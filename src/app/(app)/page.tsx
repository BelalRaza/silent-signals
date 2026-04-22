// 'use client';

// // import Image from 'next/image';
// // import Link from 'next/link';
// // import { Button } from '@/components/ui/button';
// import { Mail } from 'lucide-react'; 
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import autoplay from "embla-carousel-autoplay"


// import messages from '@/messages.json';

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from '@/components/ui/carousel';

// export default function Home() {
//   return (
//     <>
//       {/* Main content */}
//       <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
//         <section className="text-center mb-8 md:mb-12">
//           <h1 className="text-3xl md:text-5xl font-bold">
//             Dive into the World of Anonymous Feedback
//           </h1>
//           <p className="mt-3 md:mt-4 text-base md:text-lg">
//             Silent Signal - Where your identity remains a secret.
//           </p>
//         </section>

//         {/* Carousel for Messages */}
//         <Carousel
//           plugins={[autoplay({ delay: 2000 })]}
//           className="w-full max-w-lg md:max-w-xl"
//         >
//           <CarouselContent>
//             {messages.map((message, index) => (
//               <CarouselItem key={index} className="p-4">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>{message.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
//                     <Mail className="flex-shrink-0" />
//                     <div>
//                       <p>{message.content}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {message.received}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//         </Carousel>
//       </main>

//       {/* Footer */}
//       <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
//         MADE BY BELAL RAZA
//       </footer>
//     </>
//   );
// }



'use client';

import { Mail, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16 md:py-24 bg-background">
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-16 max-w-3xl">
          <div className="inline-flex items-center justify-center mb-6 px-4 py-2 bg-gray-200 rounded-full border border-gray-400">
            <MessageCircle className="w-4 h-4 mr-2 text-black" />
            <span className="text-sm font-bold text-black">Anonymous Feedback Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
            Share Your Honest Thoughts Anonymously
          </h1>
          
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            Silent Signal connects people through genuine, anonymous feedback. Express yourself freely without fear of judgment.
          </p>
        </section>

        {/* Testimonials Carousel */}
        <div className="w-full max-w-2xl mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
            What People Are Saying
          </h2>
          
          <Carousel
            plugins={[Autoplay({ delay: 4000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-2">
                  <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-black">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <Mail className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                        <div className="flex-grow">
                          <p className="text-black leading-relaxed mb-2">
                            {message.content}
                          </p>
                          <p className="text-xs text-gray-600 font-medium">
                            {message.received}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
          <div className="text-center p-6 rounded-lg bg-card border border-border/50">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-semibold text-black mb-2">Anonymous</h3>
            <p className="text-sm text-black">Your identity stays completely private</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card border border-border/50">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-semibold text-black mb-2">Direct</h3>
            <p className="text-sm text-black">Honest feedback delivered straight to you</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card border border-border/50">
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-semibold text-black mb-2">Safe</h3>
            <p className="text-sm text-black">A respectful community dedicated to growth</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Silent Signal</h3>
            <p className="text-sm text-foreground">Where your identity remains a secret</p>
          </div>
          <p className="text-sm text-foreground mt-4 md:mt-0">
            Crafted with care by <span className="font-medium text-foreground">Belal Raza</span>
          </p>
        </div>
      </footer>
    </>
  );
}