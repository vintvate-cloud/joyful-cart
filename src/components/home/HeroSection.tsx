import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    return (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-toy-cyan/5">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-toy-orange/10 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -45, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-toy-purple/10 blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-toy-orange/10 border border-toy-orange/20 text-toy-orange font-display font-bold text-sm mb-6">
                            <Sparkles className="h-4 w-4" />
                            <span>Unwrap the Magic of Play</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1] mb-6">
                            Where Every <span className="text-toy-orange">Toy</span> Tells a Story
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground font-body mb-8 max-w-lg leading-relaxed">
                            Discover a world of wonder with our curated collection of toys that inspire creativity,
                            learning, and endless joy for children of all ages.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-bold bg-toy-orange hover:bg-toy-orange/90 text-white shadow-lg shadow-toy-orange/20 transition-all hover:scale-105">
                                <Link to="/shop">
                                    Shop All Toys
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg font-bold border-2 border-toy-cyan text-toy-cyan hover:bg-toy-cyan/5 transition-all hover:scale-105">
                                <Link to="/about">Our Story</Link>
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-toy-cyan/20 flex items-center justify-center text-xl shadow-sm">
                                        {["🧸", "🎨", "🚀", "🎮"][i - 1]}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="font-display font-bold text-foreground">10k+ Happy Kids</p>
                                <div className="flex text-amber-400">
                                    {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                        className="relative"
                    >
                        <div className="relative z-10 w-full aspect-square rounded-[3rem] bg-gradient-to-br from-toy-cyan to-toy-purple p-1 overflow-hidden shadow-2xl rotate-3">
                            <div className="w-full h-full rounded-[2.8rem] bg-white overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1200"
                                    alt="Joyful Cart Toys"
                                    className="w-full h-full object-cover"
                                />

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-1/4 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-toy-cyan/20"
                                >
                                    <span className="text-3xl">🧸</span>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-1/4 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-toy-orange/20"
                                >
                                    <span className="text-3xl">🧩</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Background Blob */}
                        <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-gradient-to-br from-toy-orange/20 to-toy-purple/20 blur-3xl -z-10 animate-pulse" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
