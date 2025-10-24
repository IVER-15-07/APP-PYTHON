// Silencia logs durante los tests
process.env.NODE_ENV = 'test';

let logSpy, warnSpy, errorSpy;

beforeAll(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  logSpy.mockRestore();
  warnSpy.mockRestore();
  errorSpy.mockRestore();
});