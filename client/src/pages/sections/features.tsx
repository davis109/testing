
import { Camera, Headphones } from 'lucide-react';
import { motion } from 'framer-motion'

const Features = () => {
    return (
        <>

            <div className="flex flex-col min-h-screen items-center justify-center bg-black p-4 text-white">
                <div className='flex p-8  md:p-0'> </div>

                <button
                    className="flex items-center gap-3 px-6 py-3 text-white/90 rounded-full 
                          border border-gray-800 bg-black/50 backdrop-blur-sm
                          "
                >
                    Our features
                </button>
                <div className='flex p-3 md:p-10'></div>
                <div className="container mx-auto text-center">
                    <motion.span className="md:text-6xl  text-2xl font-normal pb-5 transition-all duration-300 bg-clip-text text-transparent bg-gradient-to-r from-[#e3efe8] to-[#96a7cf]"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 2 }}>
                        Your creativity unlocked with AI
                    </motion.span>
                </div>
                <div className='flex p-3 md:p-10'></div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-8">

                    <button className="flex items-center justify-center gap-3 px-6 py-3 text-white/90 rounded-full 
                          border border-gray-800 bg-black/50 backdrop-blur-sm
                          hover:bg-gray-900/80 transition-all duration-300">
                        <Camera className="w-5 h-5 text-purple-500" />
                        <span >Videos & Images</span>
                    </button>

                    <button className="flex items-center justify-center gap-3 px-6 py-3 text-white/90 rounded-full 
                          border border-gray-800 bg-black/50 backdrop-blur-sm
                          hover:bg-gray-900/80 transition-all duration-300">
                        {/* <Cube className="w-5 h-5 text-gray-400" /> */}
                        <span>3D & Realtime</span>
                    </button>

                    {/* Audio */}
                    <button className="flex items-center justify-center gap-3 px-6 py-3 text-white/90 rounded-full 
                          border border-gray-800 bg-black/50 backdrop-blur-sm
                          hover:bg-gray-900/80 transition-all duration-300">
                        <Headphones className="w-5 h-5 text-gray-400" />
                        <span>Audio</span>
                    </button>
                </div>

                <div className='flex p-10 md:p-20'></div>

                <div className='flex flex-col md:flex-row gap-4 md:gap-20 items-center md:items-start' >
                    <div className='flex flex-col gap-4 items-center md:items-start md:gap-3'>
                        <div className='font-normal text-3xl md:text-5xl md:text-left '>
                            <motion.span className="md:text-5xl text-3xl font-bold transition-all duration-300 bg-clip-text text-transparent bg-gradient-to-r from-[#e3efe8] to-[#96a7cf]"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 2 }}>
                                Videos and Images
                            </motion.span>
                        </div>
                        <div className='text-center md:text-left font-light text-md md:text-xl text-gradient-to-r from-[#e3efe8] to-[#96a7cf] '>
                            Generate videos & images <br />using the latest open source models.
                        </div>

                        <div className="flex justify-center">
                            <button className="bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white py-2 px-6 rounded-full border border-gray-500 transition-transform transform hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600">
                                View Examples
                            </button>
                        </div>

                    </div>

                    <div className="flex h-[400px]">
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
            </div>
        </>

    );
};

export default Features;