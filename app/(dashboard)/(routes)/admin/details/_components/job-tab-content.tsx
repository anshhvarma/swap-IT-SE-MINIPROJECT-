import PageContents from "@/app/(publicroutes)/explore/_components/page-contents";

  
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
    createdAt: Date | null;
    updatedAt: Date | null;
  }
  
  interface Category {
    id: string | null;
    name: string | null;
  }
  
  interface JobContentPageProps {
    userId: string | undefined | null;
    // college: College;
    events: Event[];
  }

const JobtabContentPage = ({events, userId}: JobContentPageProps) => {
  return <PageContents events={events} userId={userId ?? null}/>
}

export default JobtabContentPage