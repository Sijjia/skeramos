'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { ContactButtons } from './ContactButtons';

interface ContactModalProps {
  phone?: string;
  whatsappMessage?: string;
  telegramUsername?: string;
  buttonText?: string;
  buttonClassName?: string;
}

export function ContactModal({
  phone,
  whatsappMessage,
  telegramUsername,
  buttonText = 'Связаться с нами',
  buttonClassName,
}: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={buttonClassName || "group inline-flex items-center gap-3 px-8 py-4 glass text-neutral-700 rounded-2xl font-medium transition-all hover:bg-zone-500 hover:text-white hover:shadow-lg hover:shadow-zone-500/30"}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.span
          className="flex items-center justify-center w-10 h-10 rounded-full bg-zone-500/10 group-hover:bg-white/20 transition-colors"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <MessageCircle className="w-5 h-5 text-zone-500 group-hover:text-white transition-colors" />
        </motion.span>
        <span>{buttonText}</span>
        <motion.span
          className="ml-1"
          initial={{ x: 0 }}
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-zone-500/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-zone-500" />
                </div>
                <h3 className="text-2xl font-display font-medium text-neutral-800 mb-2">
                  Свяжитесь с нами
                </h3>
                <p className="text-neutral-500">
                  Выберите удобный способ связи
                </p>
              </div>

              {/* Contact Buttons */}
              <ContactButtons
                phone={phone}
                whatsappMessage={whatsappMessage}
                telegramUsername={telegramUsername}
                variant="vertical"
                size="lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
