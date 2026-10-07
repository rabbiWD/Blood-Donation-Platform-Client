import { Heart, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote:
      "When my mother had emergency surgery at Dhaka Medical College, we needed 3 bags of O-negative blood within two hours. LifeLink connected us with two generous donors who arrived in under 45 minutes.",
    author: "Tanvir Ahmed",
    role: "Patient Relative",
    location: "Dhaka",
    avatar: "TA",
    group: "O-",
  },
  {
    quote:
      "I've donated blood 8 times through LifeLink. Knowing that every notification is a real emergency at a verified hospital gives me the confidence that my donation is genuinely saving a human life.",
    author: "Nusrat Jahan",
    role: "Voluntary Lifesaver Donor",
    location: "Chittagong",
    avatar: "NJ",
    group: "B+",
  },
  {
    quote:
      "As a physician, finding rare blood types during ICU emergencies was a heartbreaking challenge. LifeLink's real-time network has made cross-district coordination seamless and rapid.",
    author: "Dr. Kazi Mahfuz",
    role: "Critical Care Specialist",
    location: "Sylhet",
    avatar: "KM",
    group: "A+",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Stories of Hope
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Saved by Compassion
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Behind every notification is a real family, a dedicated donor, and a
            miracle made possible by collective humanity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <Card
              key={item.author}
              className="flex flex-col justify-between border bg-card transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <Quote className="size-6 text-primary/40" />
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    <Heart className="size-3 fill-current" />
                    {item.group}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {item.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-foreground">
                      {item.author}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.role} · {item.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
