import Image from "next/image";
import Reachout from "./Reachout";

export default function About() {
    return (
        <div className="w-full bg-white">
            {/* Hero Section */}
            <section className="relative h-[100vh] w-full">
                <Image
                    src="/images/about.jpg"
                    alt="About EUTRIV Health Care"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-3xl text-center sm:text-5xl font-bold text-white drop-shadow-lg">
                        About Us
                    </h1>
                </div>
            </section>

            {/* About Section */}
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Dedicated to Enhancing Health with Integrative Care
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    At EUTRIV Health Care, we are committed to empowering our clients to achieve optimal health through personalized, integrative care. Our approach combines evidence-based medical practices with holistic wellness strategies to address the unique needs of each client. With a team of dedicated professionals, we provide compassionate care that fosters long-term health and vitality, ensuring every client feels supported on their wellness journey.
                </p>
            </section>

            {/* Goals Section */}
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center -mt-20">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Our Goals
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Our primary goal is to deliver exceptional healthcare services that prioritize the well-being of our clients. We aim to innovate within the healthcare industry by integrating advanced medical technologies with holistic practices, ensuring comprehensive care. By fostering a client-centered environment, we strive to build trust, promote preventive care, and empower clients to take charge of their health.
                </p>
            </section>

            {/* Mission and Vision Section */}
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto -mt-20">
                <div className="flex flex-col md:flex-row space-x-0 md:space-x-6 items-center">
                    <div className="relative w-full md:w-1/2 h-64 md:h-96 mb-6 md:mb-0">
                        <Image
                            src="/images/mission.jpg"
                            alt="EUTRIV Health Care Mission"
                            fill
                            className="object-cover rounded-lg"
                            priority
                        />
                    </div>
                    <div className="w-full md:w-1/2 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            Our Mission
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Our mission at EUTRIV Health Care is to provide client-focused, integrative healthcare that enhances physical, mental, and emotional well-being. We are dedicated to delivering personalized treatment plans that combine cutting-edge medical solutions with holistic therapies, ensuring every client receives care tailored to their unique needs.
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            Our Vision
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            We envision a world where every client has access to comprehensive, compassionate, and integrative healthcare. EUTRIV Health Care strives to lead the industry by setting new standards in client care, fostering wellness communities, and promoting sustainable health practices that inspire lifelong vitality.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Choose Our Care Section */}
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center -mt-20">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Why Choose Our Care
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    At EUTRIV Health Care, we stand out by offering a unique blend of medical expertise and holistic wellness tailored to each client’s needs. Our multidisciplinary team collaborates to create personalized care plans that promote healing and long-term health. With state-of-the-art facilities, compassionate support, and a commitment to preventive care, we ensure our clients receive unparalleled service in a welcoming environment.
                </p>
            </section>
            <Reachout />
        </div>
    );
}