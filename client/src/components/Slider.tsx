import { useRef } from 'react';
import { motion, useAnimationFrame, useSpring, useTransform } from 'framer-motion';


const InfiniteCinematicSlider = () => {

    const baseVelocity = -1;
    const baseX = useRef(0);
    const scrollX = useSpring(0, {
        damping: 50,
        stiffness: 400
    });

    const slides = [
        {
            url: "/slider-images/image-1.jpg",
            alt: "Cyberpunk city street with neon lights",
            color: "from-blue-900/50"
        },
        {
            url: "/slider-images/image-2.jpg",
            alt: "Futuristic police vehicle",
            color: "from-cyan-900/50"
        },
        {
            url: "/slider-images/image-3.jpg",
            alt: "Astronaut on alien planet",
            color: "from-green-900/50"
        },
        {
            url: "/slider-images/image-4.jpg",
            alt: "Post-apocalyptic cityscape",
            color: "from-amber-900/50"
        },
        {
            url: "/slider-images/image-5.jpg",
            alt: "Dystopian night scene",
            color: "from-purple-900/50"
        }
    ];

    const doubledSlides = [...slides, ...slides];
    const slideWidth = 400;
    const gap = 16;
    const totalWidth = (slideWidth + gap) * slides.length;

    useAnimationFrame((t, delta) => {
        baseX.current -= baseVelocity;

        if (baseX.current <= -totalWidth) {
            baseX.current = 0;
        } else if (baseX.current > 0) {
            baseX.current = -totalWidth;
        }

        scrollX.set(baseX.current);
    });

    return (
        <div className="relative h-[400px] w-full overflow-hidden m bg-black">
            <div className="absolute inset-0 bg-black/40 mix-blend-overlay z-10" />

            <div className="absolute left-0 top-0 h-full w-[15%] bg-gradient-to-r from-black to-transparent z-20" />
            <div className="absolute right-0 top-0 h-full w-[15%] bg-gradient-to-l from-black to-transparent z-20" />

            <div className="relative h-full perspective-[2000px] transform-gpu">
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 flex"
                    style={{ x: scrollX }}
                >
                    {doubledSlides.map((slide, index) => (
                        <motion.div
                            key={index}
                            className="relative mx-2 h-[320px] w-[400px] flex-shrink-0 transform-gpu"
                            style={{
                                rotateY: useTransform(
                                    scrollX,
                                    [(-index - 1) * slideWidth, -index * slideWidth, (-index + 1) * slideWidth],
                                    [-20, 0, 20]
                                ),
                                z: useTransform(
                                    scrollX,
                                    [(-index - 1) * slideWidth, -index * slideWidth, (-index + 1) * slideWidth],
                                    [-100, 0, -100]
                                )
                            }}
                        >

                            <div className="relative h-full w-full overflow-hidden rounded-lg">
                                <div className={`absolute inset-0 bg-gradient-to-b ${slide.color} to-transparent opacity-60 mix-blend-overlay`} />
                                <img
                                    src={slide.url}
                                    alt={slide.alt}
                                    className="h-full w-full object-cover brightness-90 contrast-125"
                                />
                                <div className="absolute top-0 h-[10%] w-full bg-gradient-to-b from-black to-transparent" />
                                <div className="absolute bottom-0 h-[10%] w-full bg-gradient-to-t from-black to-transparent" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

        </div>
    );
};

export default InfiniteCinematicSlider;