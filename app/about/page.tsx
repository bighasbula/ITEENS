'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Danial',
    image: '/images/team/danial.png',
    placeholder: '/images/team/placeholder.svg',
    role: 'Team Member'
  },
  {
    name: 'Alsu',
    image: '/images/team/alsu.png',
    placeholder: '/images/team/placeholder.svg',
    role: 'Team Member'
  },
  {
    name: 'Bulatzhan',
    image: '/images/team/bulatzhan.png',
    placeholder: '/images/team/placeholder.svg',
    role: 'Team Member'
  },
  {
    name: 'Arseniy',
    image: '/images/team/arseniy.png',
    placeholder: '/images/team/placeholder.svg',
    role: 'Team Member'
  },
  {
    name: 'Nurakhmed',
    image: '/images/team/nurakhmed.png',
    placeholder: '/images/team/placeholder.svg',
    role: 'Team Member'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 pt-20 sm:pt-24">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-5 sm:py-6 max-w-7xl">
        {/* What is ITEENS Section */}
        <section className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-center mb-4 sm:mb-5">
            What is ITEENS
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 card-hover">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <p className="text-white text-sm sm:text-base leading-relaxed font-body mb-3 sm:mb-4">
                  ITEENS is a group of ambitious people who united together to create a new world. 
                  We focus on empowering teens in tech, providing opportunities, knowledge, and hosting 
                  events like hackathons and social meet-ups. Our mission is to inspire the next 
                  generation of innovators and creators.
                </p>
                <p className="text-white text-sm sm:text-base leading-relaxed font-body">
                  We believe that every teenager has the potential to change the world through technology. 
                  That&apos;s why we create platforms like this competitive coding arena, where young minds 
                  can learn, practice, and grow together. Follow us on social platforms and get in touch 
                  to join our community of tech enthusiasts!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Meet our team Section */}
        <section className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-white text-center mb-5 sm:mb-6">
            Meet our team
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center" data-member={member.name}>
                <div className="relative mb-2 sm:mb-3">
                  {/* Image Container with Placeholder */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto rounded-md overflow-hidden bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center relative card-hover hover:border-white/50 transition-all">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      onError={() => {
                        // Fallback to placeholder if image fails to load
                        const placeholder = document.querySelector(`[data-member="${member.name}"] .placeholder`);
                        if (placeholder) {
                          placeholder.classList.remove('hidden');
                        }
                      }}
                    />
                    {/* Placeholder Frame */}
                    <div className="placeholder hidden absolute inset-0 w-full h-full flex flex-col items-center justify-center text-white/60 bg-white/20">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/20 rounded-full mb-1 sm:mb-2 flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium font-body">Photo Placeholder</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xs sm:text-sm md:text-base font-medium text-white mb-1 font-heading">
                  {member.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-8 sm:mt-10 text-center">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-2xl mx-auto card-hover">
            <CardContent className="p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-heading text-white mb-2 sm:mb-3">
                Get in Touch
              </h3>
              <p className="text-white/80 mb-3 sm:mb-4 text-xs sm:text-sm font-body">
                Want to join our community or learn more about ITEENS?
              </p>
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex items-center justify-center">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs px-2.5 py-1 font-body hover:bg-white/30 transition-colors">
                    Instagram: <a href="https://www.instagram.com/iteens.global/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">iteens.global</a>
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <Badge className="bg-primary/80 text-white border-0 text-xs px-2.5 py-1 font-body hover:bg-primary transition-colors">
                    Email: iteens.kz@yandex.kz
                  </Badge>
                  <Badge className="bg-primary/80 text-white border-0 text-xs px-2.5 py-1 font-body hover:bg-primary transition-colors">
                    Number: +7 777 772 1414
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
