'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import Image from "next/image";
import Reachout from "./Reachout";

export default function About() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Wait for route to load, then handle hash scroll
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }, 300); // wait a bit to ensure DOM is ready
                }
            }
        }
    }, [pathname, searchParams]);

    return (
        <div className="w-full bg-white">
            {/* Hero Section */}
            <section className="relative h-[100vh] w-full">
                <Image
                    src="/images/about4.jpg"
                    alt="About EUTRIV Health Care"
                    fill
                    className="object-cover sm:object-contain"
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
                    At EUTRIV Health, we bring compassionate, professional care right to your home.
                    Our licensed nurses and caregivers provide skilled nursing, personal assistance,
                    and private duty services that promote safety, dignity, and independence.
                    Whether you’re recovering, managing a chronic condition, or need daily support,
                    we’re here to help you live well at home.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                    EUTRIV Health Care was founded in 2023 with one goal in mind — to bring quality,
                    compassionate care right to your doorstep. Based in Sugar Land, Texas, we’re proud
                    to serve families across the state by providing Skilled Nursing, Personal Assistance
                    Services (PAS), and Private Duty Nursing (PDN).
                    At EUTRIV Health, we believe that everyone deserves to live safely, comfortably,
                    and independently at home. Our nurses and caregivers are experienced, dependable,
                    and passionate about making a difference in the lives of those we serve.
                </p>
            </section>

            {/* Goals Section */}
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center -mt-20">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Our Goals
                </h2>
                <ul className="list-disc list-inside text-left max-w-2xl mx-auto">
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Clients' Support:</strong> Support our clients’ independence and well-being through skilled, compassionate care.
                    </li>
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Foster Relationship:</strong> Build lasting relationships with clients and families based on trust and respect.
                    </li>
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Quality Assurance:</strong> Uphold the highest standards of quality, safety, and compliance.
                    </li>
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Team Growth:</strong> Continue growing a team that is dedicated, well-trained, and passionate about caring for others.
                    </li>
                </ul>
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
                            To provide personalized home health services that support independence, dignity, and peace of mind — while treating every client like family.
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            Our Vision
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            To be the trusted name in home health care across Texas, known for compassion, quality, and genuine commitment to helping people live their best life at home
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Choose Our Care Section */}
            <section id="why-choose-us" className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center -mt-20">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Why Choose EUTRIV Health Care
                </h2>
                <ul className="list-disc list-inside text-left max-w-2xl mx-auto">
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Compassionate Care:</strong> We treat you and your loved ones like family.
                    </li>
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Professional Team:</strong> Our licensed nurses and caregivers bring both skill and heart to every visit.
                    </li>
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Personalized Service:</strong> Every care plan is tailored to meet individual needs.
                    </li>
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Trusted and Certified:</strong> We are a state-licensed and Medicaid-certified agency committed to excellence.
                    </li>
                    <li className="text-gray-600 leading-relaxed mb-4">
                        <strong>Peace of Mind:</strong> We’re here to make sure you or your loved one receives the best possible care, every day.
                    </li>
                </ul>
            </section>
            {/* Message from our Team */}
            <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center -mt-20">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    A Message from Our Team
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                    At EUTRIV Health Care, we know that choosing a home health provider is a deeply
                    personal decision. That’s why we take the time to listen, understand, and provide
                    care that truly feels like home. Whether you or your loved
                    one needs skilled medical care or daily support, our team is here to walk beside you every step of the way.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Because to us, care isn’t just what we do . it’s who we are.
                </p>
            </section>
            <Reachout />
        </div>
    );
}