import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, Sparkles, MessageCircle, Calendar, Zap } from 'lucide-react';
import { sendContactMessage } from '../api/contactApi'; // contactApi.js-dən idxal

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'elnuraliyev.mail@gmail.com',
    description: 'Drop me a line anytime',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+994 (77) 535-7771',
    description: 'Available for urgent matters',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Baku, AZ',
    description: 'Open to remote collaboration',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800'
  },
  {
    icon: Clock,
    title: 'Response Time',
    value: '< 24 hours',
    description: 'Quick turnaround guaranteed',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/30',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
];

const services = [
  {
    icon: Zap,
    title: 'AI/ML Development',
    description: 'Custom machine learning solutions and model deployment',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: MessageCircle,
    title: 'Computer Vision',
    description: 'Image processing and recognition systems',
    color: 'from-blue-400 to-purple-500'
  },
  {
    icon: Calendar,
    title: 'Full-Stack Development',
    description: 'End-to-end web application development',
    color: 'from-green-400 to-blue-500'
  },
  {
    icon: Sparkles,
    title: 'API Integration',
    description: 'Seamless system integration and automation',
    color: 'from-pink-400 to-red-500'
  }
];

const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};


export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const [headerRef, headerVisible] = useIntersectionObserver(0.3);
  const [contactInfoRef, contactInfoVisible] = useIntersectionObserver(0.2);
  const [formRef, formVisible] = useIntersectionObserver(0.2);
  const [servicesRef, servicesVisible] = useIntersectionObserver(0.1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await sendContactMessage(formData);

      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
        }, 4000);
      } else {
        setErrorMessage(result.errors.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    }

    setIsSubmitting(false);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setErrorMessage('');
  };

  return (
    <section id='contact' className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">        
            Contact Me!
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Got a project or opportunity in mind? I’d love to hear from you.
          </p>
        </div>

        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              ref={contactInfoRef}
              className={`space-y-6 transition-all duration-700 ${contactInfoVisible ? 'opacity-100 translate Facade translate-x-0' : 'opacity-0 -translate-x-8'}`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Get in Touch
                </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    I'm passionate about creating innovative solutions that solve real problems.
                    Whether you're a startup looking to build your MVP or an enterprise seeking
                    to integrate AI into your workflow, I'd love to hear from you.
                    I'm always open to new ideas and collaborations. Feel free to reach out if you think we can build something useful together.
                  </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-7">
                {contactInfo.map((info, index) => (
                  <div
                    key={info.title}
                    className={`p-6 rounded-xl ${info.bgColor} border ${info.borderColor} shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-1 mt-4`}
                    style={{ transitionDelay: contactInfoVisible ? `${(index + 1) * 0.1}s` : '0s' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${info.color} flex items-center justify-center`}>
                        <info.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{info.title}</h3>
                        <p className="text-sm text-gray-900 dark:text-white font-medium">{info.value}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{info.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              ref={formRef}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-700 ${formVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            >
              <div className="relative">
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isSubmitted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Message Sent Successfully!</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      I'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>

                <div className={`transition-all duration-500 ${isSubmitted ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'}`}>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  Available for Projects & Offers      
                </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Contact me with job offers, freelance projects, or potential collaborations.
                  </p>

                  <div className="space-y-4">
                    {errorMessage && (
                      <div className="p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField('')}
                          placeholder="John Whick"
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          placeholder="john@example.com"
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField('')}
                        placeholder="Let's Talk Opportunities"
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField('')}
                        rows={4}
                        placeholder="Tell me about your offers..."
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div 
            ref={servicesRef}
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl transition-all duration-700 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                What I Can Help You With
              </h4>
              <p className="text-gray-600 dark:text-gray-300">Specialized services tailored to your needs</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className={`p-4 rounded-xl bg-gradient-to-br ${service.color} text-white transition-all duration-500 hover:-translate-y-1 shadow-md hover:shadow-lg`}
                  style={{ transitionDelay: servicesVisible ? `${(index + 1) * 0.1}s` : '0s' }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h5 className="font-semibold mb-1">{service.title}</h5>
                    <p className="text-sm">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}