// 'use client'

import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const HomePage = async () => {
  const { userId } = await auth();
  return (
    <section className="pt-12 bg-gray-50 sm:pt-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="px-6 text-lg text-gray-600 font-inter">
            &quot;From One Reader to Another - Join Our Book and Stationary{" "}
            <span className="font-bold">SWAP-IT</span> Community.&quot;
          </h1>
          <p className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight font-pj">
            Turn your visitors into profitable
            <span className="relative inline-flex sm:inline">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
              <span className="relative"> Swapss!! </span>
            </span>
          </p>

          <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex my-9">
            <Link
              href={userId ? "/search" : "/sign-in"}
              title={userId ? "Explore Products" : "Sign In"}
             
            >
              <Button>
              {userId ? "Explore" : "Sign In"}
              <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-2/3 bg-gray-50"></div>
          <div className="relative mx-auto">
            <div className="lg:max-w-6xl lg:mx-auto">
              <img
                className="transform scale-110"
                src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/2/illustration.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
