import FeedbackCard, { FeedbackItem } from "@/components/feedback/FeedbackCard";
import Icon from "@/components/ui/Icon";

const FEEDBACK_ITEMS: FeedbackItem[] = [
  {
    name: "Ananya Singh",
    role: "Hostel Wing B",
    timeAgo: "2 days ago",
    initials: "AS",
    initialsClassName: "bg-secondary-container/20 text-secondary",
    verified: true,
    rating: 4.5,
    message:
      "The new interface is much cleaner. I found it very easy to track my plumber request. However, I think adding a photo upload feature for complaints would help technicians understand the issue before they arrive.",
    truncate: true,
  },
  {
    name: "Vikram Mehta",
    role: "Grade 12 Student",
    timeAgo: "5 days ago",
    avatarUrl: "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg",
    message:
      "Great work on the mobile app responsiveness! It's super fast even on low campus wifi.",
    likes: 12,
    comments: 2,
  },
  {
    name: "S. Murthy",
    role: "Facilities Team",
    timeAgo: "1 week ago",
    initials: "SM",
    initialsClassName: "bg-tertiary-container/20 text-tertiary",
    message:
      "As a technician, I find the job allocation dashboard much better than the old paper-based system. It saves me at least an hour of coordination every day.",
    tags: ["TechnicianSupport", "Efficiency"],
  },
  {
    name: "Priya Sharma",
    role: "Science Faculty",
    timeAgo: "2 weeks ago",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGorR2w_JwqgM8VUkJutUPooNFYPHwYR4TxwTflj-qFWmVYOGXM8PpoFabvI9hY24zGQBFEt0oNuunmozNrUYnzlaJbQxie8jPFfBCzxykfd1MBwORmubxvgtTAYkKpo4d6a-X9a0icxel35kkl2zxlTNOvXU6erMHV7yF6yIkZ36q_dpnlcXaRjL5kbQgE3WzW36_e6sVgbWNiEFFVstmPGFgtZ0bJUUwnjjQas9o-MW1-iEA3jMNyQ",
    message:
      "Requested for AC repair in Lab 3. The complaint was resolved within 4 hours. Extremely satisfied with the professionalism shown.",
  },
];

export default function FeedbackFeed() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEEDBACK_ITEMS.map((item) => (
          <FeedbackCard key={item.name} item={item} />
        ))}
      </div>
      <div className="flex justify-center pt-8">
        <button className="px-8 py-3 border border-primary text-primary font-label-md rounded-xl hover:bg-primary/5 transition-colors flex items-center gap-2">
          Load More Feedback <Icon name="expand_more" />
        </button>
      </div>
    </div>
  );
}
