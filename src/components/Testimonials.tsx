'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Ahmet Y.',
    role: 'Profesyonel Trader',
    content: 'CogniTrade sayesinde işlem stratejilerimi %40 daha verimli hale getirdim. Özellikle AI destekli analizler karar vermemi çok kolaylaştırıyor.',
    rating: 5,
    metrics: {
      profit: '+128%',
      period: '6 ay'
    }
  },
  {
    name: 'Zeynep K.',
    role: 'Kripto Fon Yöneticisi',
    content: 'Portföy yönetiminde CogniTrade vazgeçilmezim oldu. Gerçek zamanlı uyarılar ve detaylı analizler sayesinde daha isabetli kararlar alıyorum.',
    rating: 5,
    metrics: {
      profit: '+85%',
      period: '3 ay'
    }
  },
  {
    name: 'Mehmet S.',
    role: 'VIP Trader',
    content: 'Piyasadaki en kapsamlı AI analiz aracı. Teknik göstergeler ve duygu analizi kombinasyonu benzersiz bir avantaj sağlıyor.',
    rating: 5,
    metrics: {
      profit: '+245%',
      period: '1 yıl'
    }
  }
]

const Testimonials = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Trading'in Geleceği CogniTrade ile Şekilleniyor
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Yapay zeka destekli analizler, gerçek zamanlı piyasa verileri ve gelişmiş teknik göstergelerle
              trading deneyiminizi yeni bir boyuta taşıyın.
            </motion.p>
            <motion.p
              className="text-lg text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              50.000'den fazla trader, CogniTrade'in sunduğu avantajlarla daha bilinçli ve karlı işlemler gerçekleştiriyor.
              Siz de bu başarı hikayesinin bir parçası olun.
            </motion.p>
          </motion.div>
        </div>

        {/* Neden CogniTrade */}
        <motion.div 
          className="max-w-5xl mx-auto text-center bg-dark-lighter/40 backdrop-blur-sm rounded-2xl p-12 border border-gray-800 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-8">
            <motion.h3 
              className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Akıllı Trading ile Güçlü Özellikler
            </motion.h3>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-8 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">Yapay Zeka Gücü</h4>
                <p className="text-gray-400">
                  FinBERT tabanlı duygu analizi motorumuz, kripto para piyasalarındaki haberleri ve sosyal medya trendlerini 
                  gerçek zamanlı olarak analiz eder. %89'luk doğruluk oranıyla, piyasa yönünü önceden tahmin etmenize yardımcı olur.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">Gelişmiş Teknik Analiz</h4>
                <p className="text-gray-400">
                  Binance API entegrasyonu ile anlık fiyat verileri, özelleştirilebilir teknik göstergeler ve profesyonel 
                  grafik araçlarıyla trading stratejilerinizi optimize edin.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">Akıllı Portföy Yönetimi</h4>
                <p className="text-gray-400">
                  Risk yönetimi araçları, otomatik stop-loss önerileri ve portföy çeşitlendirme tavsiyeleriyle 
                  yatırımlarınızı güvence altına alın.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">7/24 Destek ve Eğitim</h4>
                <p className="text-gray-400">
                  Kapsamlı eğitim materyalleri, webinarlar ve profesyonel destek ekibimizle trading yolculuğunuzda 
                  yanınızdayız.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Kullanıcı Deneyimleri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="relative group backdrop-blur-sm bg-dark-lighter/40 rounded-xl p-8 transition-all duration-300 hover:transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl -m-0.5" />
              
              {/* Hover Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-xl transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Başarı Metriği */}
                <div className="absolute -top-4 right-4 bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full">
                  <div className="text-center">
                    <span className="text-white font-bold">{testimonial.metrics.profit}</span>
                    <span className="text-xs text-white/80 ml-1">/ {testimonial.metrics.period}</span>
                  </div>
                </div>

                {/* Yıldız Değerlendirmesi */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'
                      } group-hover:scale-110 transition-transform duration-300`}
                    />
                  ))}
                </div>

                {/* Testimonial İçeriği */}
                <blockquote className="text-gray-300 mb-6 group-hover:text-white/90">
                  "{testimonial.content}"
                </blockquote>

                {/* Kullanıcı Bilgisi */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-white group-hover:text-white/90">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm group-hover:text-gray-300">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials 