import { useState } from "react";
import { useCourseData, useGroupData, useLevelsData } from "../hooks/useCourseData";
import {
  CourseHeader,
  JoinGroupForm,
  LevelList,
  LoadingSkeleton,
  EmptyState,
} from "../components";

const Course = () => {
  const { curso, loading: loadingCourse } = useCourseData();
  const { grupo, joinGroup } = useGroupData();
  const { niveles, fetchTopicsForLevel } = useLevelsData();
  const [showForm, setShowForm] = useState(false);

  const handleJoinGroup = async (codigo) => {
    try {
      await joinGroup(codigo);
      setShowForm(false);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // Loading state
  if (loadingCourse) {
    return <LoadingSkeleton />;
  }

  // Empty state
  if (!curso) {
    return <EmptyState message="No hay cursos disponibles." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          {/* Header Section */}
          <div className={`flex items-start gap-4 ${!grupo ? 'flex-col' : 'justify-between'}`}>
            <CourseHeader curso={curso} grupo={grupo} />
            
            {!grupo && (
              <div className="w-full">
                <JoinGroupForm
                  showForm={showForm}
                  onJoin={handleJoinGroup}
                  onToggle={toggleForm}
                />
              </div>
            )}
          </div>

          {/* Levels Section */}
          <LevelList
            niveles={niveles}
            grupo={grupo}
            onFetchTopics={fetchTopicsForLevel}
          />
        </div>
      </div>
    </div>
  );
};

export default Course;
