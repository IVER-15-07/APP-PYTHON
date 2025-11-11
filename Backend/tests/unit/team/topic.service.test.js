import { topicService } from "../../../src/modules/courses/services/topic.service.js";
import cloudinary from "../../../src/config/cloudinary.js";

import { topicoRepository } from "../../../src/modules/courses/repositories/topico.repository.js";
import { recursosRepository } from "../../../src/modules/courses/repositories/resources.repository.js";

jest.mock("../../../src/config/cloudinary.js", () => ({
  __esModule: true,
  default: { uploader: { upload: jest.fn() } },
}));

jest.mock("../../../src/modules/courses/repositories/topico.repository.js", () => ({
  __esModule: true,
  topicoRepository: {
    createTopic: jest.fn(),
    getTopicById: jest.fn(),
    updateTopic: jest.fn(),
    getAllTopics: jest.fn(),
  },
}));

jest.mock("../../../src/modules/courses/repositories/resources.repository.js", () => ({
  __esModule: true,
  recursosRepository: {
    createResource: jest.fn(),
    findSingleByTopicId: jest.fn(),
    updateResource: jest.fn(),
  },
}));

const mockTopic = (over = {}) => ({
  id: 1,
  nombre: "Top 1",
  descripcion: "Desc",
  tipo_topicoId: 2, // texto
  ...over,
});

describe("topicService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createTopicWithResource (texto) toma PDF como principal y sube imagen adjunta", async () => {
    topicoRepository.createTopic.mockResolvedValue(mockTopic({ tipo_topicoId: 2 }));

    // 1) principal (pdf), 2) imagen
    cloudinary.uploader.upload
      .mockResolvedValueOnce({ secure_url: "https://res.cloud/raw/upload/doc.pdf", public_id: "pub_pdf" })
      .mockResolvedValueOnce({ secure_url: "https://res.cloud/image/upload/img.jpg", public_id: "pub_img" });

    recursosRepository.createResource.mockResolvedValue({ id: 9 });

    const data = { nombre: "T", descripcion: "D", tipo_topicoId: 2, nivelId: 1 };
    const files = [
      { mimetype: "application/pdf", originalname: "doc.pdf", path: "/tmp/doc.pdf" },
      { mimetype: "image/jpeg", originalname: "img.jpg", path: "/tmp/img.jpg" },
    ];

    const out = await topicService.createTopicWithResource(data, files);

    // Verifica tipos usados en Cloudinary
    expect(cloudinary.uploader.upload).toHaveBeenNthCalledWith(
      1,
      "/tmp/doc.pdf",
      expect.objectContaining({ resource_type: "raw", folder: "recursos", type: "upload" })
    );
    expect(cloudinary.uploader.upload).toHaveBeenNthCalledWith(
      2,
      "/tmp/img.jpg",
      expect.objectContaining({ resource_type: "image" })
    );

    expect(recursosRepository.createResource).toHaveBeenCalledWith(
      expect.objectContaining({
        topicoId: 1,
        url: "https://res.cloud/raw/upload/doc.pdf",
        imagenurl: "https://res.cloud/image/upload/img.jpg",
        publicId: "pub_pdf",
      })
    );
    expect(out).toEqual(expect.objectContaining({ resource: { id: 9 } }));
  });

  test("createTopicWithResource (video) usa audio/video como principal", async () => {
    topicoRepository.createTopic.mockResolvedValue(mockTopic({ tipo_topicoId: 1 }));

    cloudinary.uploader.upload.mockResolvedValueOnce({
      secure_url: "https://res.cloud/video/upload/a.mp3",
      public_id: "pub_a",
    });
    recursosRepository.createResource.mockResolvedValue({ id: 10 });

    const data = { nombre: "Tv", descripcion: "Dv", tipo_topicoId: 1, nivelId: 1 };
    const files = [{ mimetype: "audio/mpeg", originalname: "a.mp3", path: "/tmp/a.mp3" }];

    await topicService.createTopicWithResource(data, files);

    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      "/tmp/a.mp3",
      expect.objectContaining({ resource_type: "video" })
    );
    expect(recursosRepository.createResource).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://res.cloud/video/upload/a.mp3", publicId: "pub_a" })
    );
  });

  test("createTopicWithResource lanza error si no envías archivos", async () => {
    topicoRepository.createTopic.mockResolvedValue(mockTopic());
    await expect(
      topicService.createTopicWithResource({ tipo_topicoId: 2, nivelId: 1 }, [])
    ).rejects.toThrow(/Se requiere al menos un archivo/i);
  });

  test("updateTopicWithResources actualiza imagen y subtítulo; respeta main si aplica", async () => {
    topicoRepository.getTopicById.mockResolvedValue(mockTopic());
    recursosRepository.findSingleByTopicId.mockResolvedValue({ id: 7, publicId: "pub1", imagenurl: "old.jpg" });

    cloudinary.uploader.upload
      .mockResolvedValueOnce({ secure_url: "https://res.cloud/image/upload/new.jpg", public_id: "pub1" }) // imagen
      .mockResolvedValueOnce({ secure_url: "https://res.cloud/image/upload/sub.vtt", public_id: "pub1" }); // subtitulo (raw sería ideal, pero el servicio actual usa image)

    await topicService.updateTopicWithResources(
      1,
      { nombre: "Nuevo", main: "imagenurl" },
      [
        { mimetype: "image/png", path: "/tmp/new.png", originalname: "new.png" },
        { mimetype: "text/vtt", path: "/tmp/sub.vtt", originalname: "sub.vtt" },
      ]
    );

    expect(recursosRepository.updateResource).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        imagenurl: "https://res.cloud/image/upload/new.jpg",
        subtitulo: "https://res.cloud/image/upload/sub.vtt",
        publicId: "pub1",
      })
    );
  });

  test("getTopicForStudent (texto) retorna pdf como urlPrincipal", async () => {
    topicoRepository.getTopicById.mockResolvedValue({
      id: 1,
      nombre: "T",
      descripcion: "D",
      tipo_topico: { nombre: "texto" },
      nivel: { nombre: "N1" },
      recursos: [
        {
          url: "https://res.cloud/raw/upload/doc.pdf",
          imagenurl: "https://res.cloud/image/upload/img.jpg",
          audiourl: null,
          subtitulo: null,
          publicId: "pid",
        },
      ],
    });

    const dto = await topicService.getTopicForStudent(1);
    expect(dto.recurso.urlPrincipal).toBe("https://res.cloud/raw/upload/doc.pdf");
    expect(dto.recurso.imagen).toBe("https://res.cloud/image/upload/img.jpg");
  });

  test("getTopicForStudent (video) cae a audio si no hay url", async () => {
    topicoRepository.getTopicById.mockResolvedValue({
      id: 2,
      nombre: "Tv",
      descripcion: "Dv",
      tipo_topico: { nombre: "video" },
      nivel: { nombre: "N1" },
      recursos: [
        {
          url: null,
          imagenurl: null,
          audiourl: "https://res.cloud/video/upload/a.mp3",
          subtitulo: null,
          publicId: "p2",
        },
      ],
    });

    const dto = await topicService.getTopicForStudent(2);
    expect(dto.recurso.urlPrincipal).toBe("https://res.cloud/video/upload/a.mp3");
  });

  test("getTopicForStudent lanza si el tópico no existe", async () => {
    topicoRepository.getTopicById.mockResolvedValue(null);
    await expect(topicService.getTopicForStudent(999)).rejects.toThrow(/Tópico no encontrado/i);
  });
});