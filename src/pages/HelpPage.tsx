import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Bitcoin,
  Gamepad2,
  Users,
  Trophy,
  Clock,
  Star,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  MessageCircle,
  Mail,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/satsurge.png';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: 'getting-started-1',
    question: 'What is Satsurge and how does it work?',
    answer: 'Satsurge is a Lightning Network-powered skill gaming platform where players compete in micro-tournaments for Bitcoin rewards. Players pay small entry fees via Lightning payments, compete in 1-3 minute skill-based games, and winners receive instant payouts.',
    category: 'Getting Started',
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    id: 'getting-started-2',
    question: 'How do I create an account?',
    answer: 'Simply click "Sign In" and connect your Lightning wallet. We support major Lightning wallets like Alby, Phoenix, and others. No email or personal information required - just your Lightning node!',
    category: 'Getting Started',
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 'getting-started-3',
    question: 'What Lightning wallets are supported?',
    answer: 'We support all major Lightning wallets including Alby, Phoenix, Breez, Zeus, and others that support LNURL or Lightning invoices. Make sure your wallet has sufficient balance for entry fees.',
    category: 'Getting Started',
    icon: <Bitcoin className="h-5 w-5" />
  },

  // Gaming & Tournaments
  {
    id: 'gaming-1',
    question: 'How long do games typically last?',
    answer: 'Most tournaments are designed as micro-games lasting 1-3 minutes. This allows for quick, intense competition and frequent opportunities to earn sats throughout your gaming session.',
    category: 'Gaming & Tournaments',
    icon: <Clock className="h-5 w-5" />
  },
  {
    id: 'gaming-2',
    question: 'What types of games are available?',
    answer: 'We offer various skill-based games including reaction tests, precision challenges, memory games, and strategy puzzles. New games are added regularly by our creator community.',
    category: 'Gaming & Tournaments',
    icon: <Gamepad2 className="h-5 w-5" />
  },
  {
    id: 'gaming-3',
    question: 'How are winners determined?',
    answer: 'Winners are determined by objective scoring criteria for each game type. All scoring happens server-side to prevent cheating, and we maintain replay verification systems for transparency.',
    category: 'Gaming & Tournaments',
    icon: <Trophy className="h-5 w-5" />
  },
  {
    id: 'gaming-4',
    question: 'What is the minimum and maximum entry fee?',
    answer: 'Entry fees typically range from 50 to 500 sats per tournament. The exact amount depends on the game and tournament size. Larger tournaments may have higher entry fees with bigger prize pools.',
    category: 'Gaming & Tournaments',
    icon: <Target className="h-5 w-5" />
  },

  // Payments & Rewards
  {
    id: 'payments-1',
    question: 'How quickly do I receive my winnings?',
    answer: 'Winnings are paid out instantly via Lightning Network upon tournament completion. You should see the sats in your Lightning wallet within seconds of winning.',
    category: 'Payments & Rewards',
    icon: <Zap className="h-5 w-5" />
  },
  {
    id: 'payments-2',
    question: 'What percentage of the prize pool do winners receive?',
    answer: 'Winners receive 75% of the total prize pool. The remaining 25% is split between the game creator (10%) and the platform (15%) to support development and content creation.',
    category: 'Payments & Rewards',
    icon: <Star className="h-5 w-5" />
  },
  {
    id: 'payments-3',
    question: 'Are there any fees for receiving payments?',
    answer: 'No additional fees are charged for receiving payments. Lightning Network fees are minimal and typically covered by the platform. You receive the full winning amount.',
    category: 'Payments & Rewards',
    icon: <CheckCircle className="h-5 w-5" />
  },

  // Game Creation
  {
    id: 'creation-1',
    question: 'How can I become a game creator?',
    answer: 'Sign up as a creator and use our visual game editor powered by Blockly and Phaser. You can start from templates or build games from scratch using our drag-and-drop interface.',
    category: 'Game Creation',
    icon: <Gamepad2 className="h-5 w-5" />
  },
  {
    id: 'creation-2',
    question: 'How much can I earn as a game creator?',
    answer: 'Creators earn 10% of all entry fees from their games. Popular games with high player engagement can generate significant ongoing revenue through tournament participation.',
    category: 'Game Creation',
    icon: <Bitcoin className="h-5 w-5" />
  },
  {
    id: 'creation-3',
    question: 'What programming knowledge do I need?',
    answer: 'No programming knowledge required! Our visual editor uses Blockly blocks that snap together like puzzle pieces. However, advanced creators can add custom JavaScript for more complex features.',
    category: 'Game Creation',
    icon: <Target className="h-5 w-5" />
  },

  // Security & Fair Play
  {
    id: 'security-1',
    question: 'How does Satsurge prevent cheating?',
    answer: 'We use server-side scoring, replay verification, bot detection, and anti-automation measures. All game logic runs on our servers, and suspicious activity is automatically flagged.',
    category: 'Security & Fair Play',
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 'security-2',
    question: 'Is my Lightning wallet information secure?',
    answer: 'We never store your private keys or sensitive wallet information. We only interact with your Lightning node through secure protocols like LNURL and Lightning invoices.',
    category: 'Security & Fair Play',
    icon: <Shield className="h-5 w-5" />
  },
  {
    id: 'security-3',
    question: 'How do I report suspicious behavior?',
    answer: 'Use the report button in any game or contact our support team. We investigate all reports and take appropriate action including temporary or permanent bans for confirmed violations.',
    category: 'Security & Fair Play',
    icon: <AlertCircle className="h-5 w-5" />
  },

  // Technical Support
  {
    id: 'technical-1',
    question: 'What if a payment fails or gets stuck?',
    answer: 'Failed payments are automatically refunded within 24 hours. If you experience issues, contact support with your transaction ID and we\'ll investigate immediately.',
    category: 'Technical Support',
    icon: <AlertCircle className="h-5 w-5" />
  },
  {
    id: 'technical-2',
    question: 'Can I play on mobile devices?',
    answer: 'Yes! Satsurge is fully responsive and works on all devices. However, we recommend using a device with a stable internet connection for the best gaming experience.',
    category: 'Technical Support',
    icon: <Globe className="h-5 w-5" />
  },
  {
    id: 'technical-3',
    question: 'What if I experience lag or connection issues?',
    answer: 'Try refreshing your browser and check your internet connection. If problems persist, games are automatically paused during network issues and resume when connection is restored.',
    category: 'Technical Support',
    icon: <Info className="h-5 w-5" />
  }
];

const categories = [
  'All',
  'Getting Started',
  'Gaming & Tournaments',
  'Payments & Rewards',
  'Game Creation',
  'Security & Fair Play',
  'Technical Support'
];

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-orange-500" />
              <img 
                src={logo} 
                alt="Satsurge Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Satsurge
              </span>
            </Link>
            
            <Link 
              to="/auth" 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 rounded-full">
              <HelpCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Help & <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">FAQ</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about Satsurge, Lightning payments, game creation, and more.
          </p>
        </motion.div>

        {/* Quick Contact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-8 mb-12 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need More Help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm">Get instant help from our support team</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Keybase Support</h3>
              <p className="text-gray-600 text-sm">keybase.io/istealkids</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GitHub Community</h3>
              <p className="text-gray-600 text-sm">Join our community for tips and updates</p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-sm'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-4"
        >
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-orange-500">
                      {faq.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  {openFAQ === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">Try selecting a different category or contact our support team.</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl mb-6 text-orange-100">
              Our support team is here to help you get the most out of Satsurge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth" 
                className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all inline-flex items-center justify-center"
              >
                Get Started <Zap className="ml-2 h-5 w-5" />
              </Link>
              <button onClick={() => window.open('https://github.com/axelvyrn/Satsurge/issues', '_blank')} className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
