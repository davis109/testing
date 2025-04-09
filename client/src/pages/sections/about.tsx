import { motion } from 'framer-motion';

function AboutPage() {
    return (
        <div className="flex flex-col justify-center items-center text-white bg-black md:h-[1100px] h-[500px]">
            <div className="container mx-auto md:pt-10 pt-20 text-center">
                <motion.span
                    className="md:text-7xl text-2xl font-normal pb-5 transition-all duration-300 bg-clip-text text-transparent bg-gradient-to-r from-[#e3efe8] to-[#96a7cf]"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2 }}
                >
                    The most powerful application <br /> for enhancing images using <br /> Generative AI
                </motion.span>
            </div>
            <div className='flex md:p-10'></div>
            <div className="flex h-[600px] pt-10">
                <video
                    className="w-full h-auto"
                    autoPlay
                    loop
                    muted
                >
                    <source src="AI video final.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}

export default AboutPage;
