"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from '@/messages.json'
export default function Home() {
  return (
    <>
      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text:5xl font-bold">Dive here</h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg ">
            Hey how are you doing
          </p>
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-xs"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>{message.title}</CardHeader>
                      <CardContent className="flex flex-col gap-2 aspect-square items-center justify-center p-6">
                        <span className="text-md font-semibold">
                          {message.content}
                        </span>
                        <span className="text-md font-semibold">
                          {message.received}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </div>
      <footer className="text-center font-semibold text-sm tracking-wide">
        2024 Mystry message. All right reserverd
      </footer>
    </>
  );
}
