import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Preview } from "@/components/preview";
import JobtabContentPage from "./job-tab-content";

interface College {
  id: string;
  userId: string;
  CollegeName: string;
  Description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  mail?: string | null;
  website?: string | null;
  linkedin?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  events?: Event[] | null;
  followers?: string[] | null;
  overview?: string | null;
  whyJoinUs?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Event {
  id: string | null;
  userId: string | null;
  title: string | null;
  description?: string | null;
  short_description?: string | null;
  imageUrl?: string | null;
  isPublished: boolean | null;
  tags: string[] | null;
  savedUsers: string[] | null;
  categoryId?: string | null;
  category?: Category | null;
  collegeId?: string | null;
  college?: College | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface Category {
  id: string | null;
  name: string | null;
}

interface TabContentSectionProps {
  userId: string | undefined | null;
  college: College;
  events: Event[];
}

const TabContentSection = ({
  userId,
  college,
  events,
}: TabContentSectionProps) => {
  return (
    <div className="w-full my-4 mt-12">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent shadow-none">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="joinus"
            className="data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            Why Join Us?
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="data-[state=active]:border-b-2 data-[state=active]:border-yellow-500 rounded-none bg-transparent text-base font-sans tracking-wide"
          >
            Events
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          {college.overview ? <Preview value={college.overview}/> : ""}
        </TabsContent>
        <TabsContent value="joinus">
          {college.whyJoinUs ? <Preview value={college.whyJoinUs || ""}/> : ""}
        </TabsContent>
        <TabsContent value="events">
         <JobtabContentPage events={events} userId={userId} />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default TabContentSection;
