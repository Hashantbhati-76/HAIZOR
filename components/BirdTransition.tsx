import React from 'react';

const Bird: React.FC<{ style: React.CSSProperties, innerStyle: React.CSSProperties }> = ({ style, innerStyle }) => (
    <div 
        className="absolute top-0 left-0 text-brand-text animate-fly-across" 
        style={style}
    >
        <div style={innerStyle}>
            <svg className="w-12 h-12" preserveAspectRatio="xMidYMid meet">
                <use href="#origami-bird" />
            </svg>
        </div>
    </div>
);

interface BirdTransitionProps {
    isVisible: boolean;
}

const birdsConfig = Array.from({ length: 80 }).map(() => ({
    startY: `${Math.random() * 100}vh`,
    endY: `${Math.random() * 100}vh`,
    delay: `${Math.random() * 1.2}s`,
    duration: `${2 + Math.random() * 1.5}s`, // Slower duration
    scale: 0.5 + Math.random(),
    opacity: 0.4 + Math.random() * 0.6,
}));


export const BirdTransition: React.FC<BirdTransitionProps> = ({ isVisible }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[200] bg-black/30 pointer-events-none overflow-hidden">
            {birdsConfig.map((config, i) => (
                <Bird
                    key={i}
                    style={{
                        '--start-y': config.startY,
                        '--end-y': config.endY,
                        animationDelay: config.delay,
                        animationDuration: config.duration,
                    } as React.CSSProperties}
                    innerStyle={{
                        transform: `scale(${config.scale})`,
                        opacity: config.opacity,
                    }}
                />
            ))}
        </div>
    );
};
