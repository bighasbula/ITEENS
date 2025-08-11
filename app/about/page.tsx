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
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 pt-14">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
             <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
         {/* What is ITEENS Section */}
         <section className="mb-12 sm:mb-16">
           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-6 sm:mb-8">
             What is ITEENS
           </h1>
           
           <div className="max-w-4xl mx-auto">
             <Card className="bg-white/10 backdrop-blur-sm border-white/20">
               <CardContent className="p-4 sm:p-6 md:p-8">
                                 <p className="text-white text-base sm:text-lg leading-relaxed">
                   ITEENS is a group of ambitious people who united together to create a new world. 
                   We focus on empowering teens in tech, providing opportunities, knowledge, and hosting 
                   events like hackathons and social meet-ups. Our mission is to inspire the next 
                   generation of innovators and creators.
                 </p>
                 <br />
                 <p className="text-white text-base sm:text-lg leading-relaxed">
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
         <section>
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primaryPurple text-center mb-8 sm:mb-12">
             Meet our team
           </h2>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
                         {teamMembers.map((member, index) => (
               <div key={index} className="text-center" data-member={member.name}>
                                 <div className="relative mb-3 sm:mb-4">
                   {/* Image Container with Placeholder */}
                   <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto rounded-lg overflow-hidden bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center relative">
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
                       <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/20 rounded-full mb-1 sm:mb-2 flex items-center justify-center">
                         <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                         </svg>
                       </div>
                       <span className="text-xs sm:text-sm font-medium">Photo Placeholder</span>
                     </div>
                  </div>
                  
                  
                </div>
                
                                 <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-white mb-2">
                   {member.name}
                 </h3>
              </div>
            ))}
          </div>
        </section>

                 {/* Contact Section */}
         <section className="mt-12 sm:mt-16 text-center">
           <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
             <CardContent className="p-4 sm:p-6">
               <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                 Get in Touch
               </h3>
               <p className="text-white/80 mb-4 text-sm sm:text-base">
                 Want to join our community or learn more about ITEENS?
               </p>
               <div className="flex flex-col gap-3 sm:gap-4">
                 <div className="flex items-center justify-center">
                   <Badge className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                     Instagram: <a href="https://www.instagram.com/iteens.global/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-200">iteens.global</a>
                   </Badge>
                 </div>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                   <Badge className="bg-primaryPurple text-white border-0 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
                     Email: iteens.kz@yandex.kz
                   </Badge>
                   <Badge className="bg-primaryPurple text-white border-0 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
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
