import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TopicCard from './TopicCard';

const TopicCarousel = ({ levelName, topics, onEdit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardsPerView = 3;
    const maxIndex = Math.max(0, topics.length - cardsPerView);

    const handlePrev = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    };

    return (
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            {/* Header del carrusel */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">{levelName}</h3>
                    <p className="text-sm text-slate-400 mt-1">{topics.length} tópico{topics.length !== 1 ? 's' : ''}</p>
                </div>
                
                {/* Controles de navegación */}
                {topics.length > cardsPerView && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-slate-400 min-w-[3rem] text-center">
                            {currentIndex + 1} / {maxIndex + 1}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex === maxIndex}
                            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Carrusel */}
            <div className="relative overflow-hidden">
                <div 
                    className="flex transition-transform duration-300 ease-in-out gap-4"
                    style={{ transform: `translateX(-${currentIndex * (100 / cardsPerView + 1.33)}%)` }}
                >
                    {topics.map((topic) => (
                        <div 
                            key={topic.id} 
                            className="flex-shrink-0"
                            style={{ width: `calc(${100 / cardsPerView}% - 1rem)` }}
                        >
                            <TopicCard 
                                topic={topic}
                                onEdit={onEdit}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

TopicCarousel.propTypes = {
    levelName: PropTypes.string.isRequired,
    topics: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default TopicCarousel;
