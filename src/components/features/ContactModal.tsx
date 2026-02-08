'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle } from 'lucide-react';
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
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClassName || "inline-flex items-center gap-2 px-6 py-3 glass text-neutral-700 hover:text-zone-500 rounded-xl font-medium transition-colors"}
      >
        <MessageCircle className="w-5 h-5" />
        {buttonText}
      </button>

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
