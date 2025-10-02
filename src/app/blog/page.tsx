'use client';

import WebBanner from '@/components/ui/WebBanner';
import Form from '@/components/ui/Form';
import { motion } from 'framer-motion';

export default function Blog() {
  return (
    <>
      <WebBanner
        title="Our Blog"
        subtitle="Insights and tips on home care."
        image="/images/blog.jpg"
      />
      <section className="section-padding">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-lora font-bold text-center text-primary"
        >
          Recent Posts
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array(3).fill(null).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="glass-effect p-6 rounded-lg"
            >
              <h3 className="text-xl font-lora font-bold text-primary">Blog Post Title</h3>
              <p className="mt-2 font-poppins text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Form title="Subscribe to Our Newsletter" />
    </>
  );
}