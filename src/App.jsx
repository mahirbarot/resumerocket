import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import ImageAnalyzer from './components/ImageAnalyzer'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import './aurora.css'
// import StartupFunding from './components/StartupFunding'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

const features = [
  {
    name: 'AI-Powered Resume Optimization',
    description: 'Automatically edit and optimize your resume to match job descriptions.',
    icon: (
      <svg
        className="h-6 w-6 text-gray-800"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    name: 'ATS Score Improvement',
    description: 'Enhance your resume to achieve a higher ATS score and increase your chances of getting noticed.',
    icon: (
      <svg
        className="h-6 w-6 text-gray-800"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8c1.654 0 3-1.346 3-3s-1.346-3-3-3-3 1.346-3 3 1.346 3 3 3zm0 2c-2.21 0-4 1.79-4 4v2h8v-2c0-2.21-1.79-4-4-4zm0 8c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"
        />
      </svg>
    ),
  },
  {
    name: 'Before & After Comparison',
    description: 'See the difference in ATS scores before and after optimization.',
    icon: (
      <svg
        className="h-6 w-6 text-gray-800"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    ),
  },
  {
    name: 'Easy Integration',
    description: 'Upload your resume in PDF or LaTeX format and get started in minutes.',
    icon: (
      <svg
        className="h-6 w-6 text-gray-800"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    ),
  },
]

const pricing = [
  {
    name: 'Starter',
    price: '$19',
    features: ['5 resume optimizations/month', 'Basic ATS score insights', 'Email support', '1 user'],
  },
  {
    name: 'Pro',
    price: '$49',
    features: ['25 resume optimizations/month', 'Advanced ATS score analytics', 'Priority support', '5 users'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Unlimited resume optimizations', 'Custom ATS score reports', 'Dedicated support', 'Unlimited users'],
  },
]

const testimonials = [
  {
    name: 'Jane Doe',
    role: 'Software Engineer',
    quote: 'ResumeRocket AI helped me land my dream job by optimizing my resume perfectly!',
    image: '/img5.png',
  },
  {
    name: 'John Smith',
    role: 'Product Manager',
    quote: 'The ATS score improvement feature is a game-changer. Highly recommend!',
    image: 'img3.png',
  },
]

const companyLogos = [
  'image.png',
  'img2.png',
  'img3.png',
  'img4.png',
]

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/ocr')
  }

  return (
    <div className="">
      {/* Replace the existing decorative background pattern with this new one */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora-container">
          <div className="aurora-1"></div>
          <div className="aurora-2"></div>
          <div className="aurora-3"></div>
        </div>
      </div>

      {/* Header */}
      
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-indigo-600">ResumeRocket AI</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="text-2xl font-bold text-indigo-600">ResumeRocket AI</span>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      {/* Updated Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-42 sm:py-48 lg:py-20 lg:pb-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                New feature release.{' '}
                <a href="#" className="font-semibold text-indigo-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
            AI-Powered Resume Optimization for Every Job Application
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Upload your resume and job descriptions to get a tailored, ATS-friendly resume that stands out.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="rounded-md bg-gradient-to-r from-black to-gray-800 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:from-gray-800 hover:to-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Get started
              </motion.button>
              <motion.a
                whileHover={{ x: 5 }}
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </motion.a>
            </div>

            {/* Add the companies section */}
            <div className="mt-16">
              <div className="flex items-center justify-center gap-x-2">
                <div className="flex -space-x-2">
                  {companyLogos.map((logo, i) => (
                    <img
                      key={i}
                      src={logo}
                      alt="Company logo"
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white img-hero"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  <span className="font-bold">500+</span> job-seekers already onboard
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Updated Features section */}
      <div id="features" className="relative py-24 sm:py-32 bg-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.gray.100),white)]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powerful Features for Job Seekers
            </p>
          </motion.div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  key={feature.name}
                  className="flex flex-col bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    {feature.icon}
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Updated Testimonials section */}
      <div className="py-24 sm:py-32 bg-gradient-to-b from-gray-100 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </p>
          </motion.div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                key={testimonial.name}
                className="flex flex-col overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                      <span className="hover:underline">{testimonial.name}</span>
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-900">{testimonial.role}</p>
                  </div>
                  <div className="mt-6 flex-1">
                    <p className="text-sm text-gray-500">{testimonial.quote}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-6">
                  <img className="h-12 w-12 rounded-full img-hero" src={testimonial.image} alt="" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div id="pricing" className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the perfect plan for your job search needs
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
            {pricing.map((tier, tierIdx) => (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                  tierIdx === 1 ? 'bg-black text-white ring-black' : 'bg-white'
                }`}
              >
                <h3 className="text-lg font-semibold leading-8">{tier.name}</h3>
                <p className="mt-4 text-3xl font-bold tracking-tight">{tier.price}</p>
                <p className="mt-6 text-base leading-7">Per month</p>
                <ul role="list" className="mt-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-gray-800" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className={`mt-8 block w-full rounded-md px-3.5 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    tierIdx === 1
                      ? 'bg-gray-700 text-white shadow-sm hover:bg-gray-600 focus-visible:outline-gray-700'
                      : 'bg-black text-white shadow-sm hover:bg-gray-800 focus-visible:outline-black'
                  }`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-black">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-black px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to optimize your resume?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Start your free trial today and experience the power of our AI-driven resume optimization.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </button>
              <a href="#" className="text-sm font-semibold leading-6 text-white">
                Learn more <ArrowRightIcon className="inline h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-6">
        <div className="text-center text-sm text-gray-600">
          Made with <span className="text-red-500">♥</span> by{' '}
          <a 
            href="https://x.com/mahirbarott" 
            className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
            target="_blank" 
            rel="noopener noreferrer"
          >
            @mahirbarot
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
