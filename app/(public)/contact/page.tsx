"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clock,
  HeartHandshake,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  PhoneCall,
  Send,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid contact phone number"),
  category: z.enum([
    "EMERGENCY_SUPPORT",
    "DONOR_INQUIRY",
    "HOSPITAL_PARTNERSHIP",
    "GENERAL_FEEDBACK",
  ]),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactInput = z.infer<typeof contactSchema>;

const HELPLINES = [
  {
    name: "National Health Helpline",
    number: "16263",
    desc: "Toll-free 24/7 medical advice & emergency hospital routing",
    badge: "Government of Bangladesh",
  },
  {
    name: "National Emergency Service",
    number: "999",
    desc: "Police, Fire Service, and Ambulance dispatch services",
    badge: "24/7 Rapid Response",
  },
  {
    name: "Bangladesh Red Crescent Society",
    number: "+8802222283995",
    desc: "National blood center & disaster response coordination",
    badge: "Blood Center",
  },
  {
    name: "Quantum Foundation Blood Lab",
    number: "+8801714010869",
    desc: "Emergency screened blood component availability hotline",
    badge: "Dhaka Central",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: "EMERGENCY_SUPPORT",
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (_data: ContactInput) => {
    // Simulate API dispatch
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(
      "Inquiry submitted successfully! Our emergency support team will contact you shortly.",
    );
    setSubmitted(true);
    reset();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <PageHeader
        title="Contact & Emergency Helplines"
        description="Need urgent assistance? Dial verified national medical helplines or send an inquiry to the LifeLink team."
      />

      {/* Emergency Helplines Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-red-600 animate-pulse" />
          <h2 className="font-heading text-xl font-bold">
            Emergency Blood & Medical Helplines
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HELPLINES.map((item) => (
            <Card
              key={item.number}
              className="border-red-500/20 bg-linear-to-b from-red-500/5 to-transparent transition-all hover:border-red-500/40 hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300 w-fit">
                  {item.badge}
                </span>
                <CardTitle className="font-heading text-base pt-1">
                  {item.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {item.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full gap-2 border-primary/30 text-primary font-bold hover:bg-primary hover:text-primary-foreground"
                >
                  <a href={`tel:${item.number}`}>
                    <PhoneCall className="size-4" />
                    {item.number}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form and Details */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Support Inquiry Form */}
        <div className="lg:col-span-7">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <MessageSquare className="size-5 text-primary" />
                Send an Inquiry or Feedback
              </CardTitle>
              <CardDescription>
                Fill out the form below. For life-threatening emergencies,
                please dial the helplines directly.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      disabled={isSubmitting}
                      {...register("name")}
                    />
                    {errors.name ? (
                      <p className="text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      disabled={isSubmitting}
                      {...register("email")}
                    />
                    {errors.email ? (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+8801700000000"
                      disabled={isSubmitting}
                      {...register("phone")}
                    />
                    {errors.phone ? (
                      <p className="text-xs text-destructive">
                        {errors.phone.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Inquiry Category</Label>
                    <Select
                      defaultValue="EMERGENCY_SUPPORT"
                      onValueChange={(val) =>
                        setValue("category", val as ContactInput["category"])
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMERGENCY_SUPPORT">
                          Emergency Assistance
                        </SelectItem>
                        <SelectItem value="DONOR_INQUIRY">
                          Donor Profile Support
                        </SelectItem>
                        <SelectItem value="HOSPITAL_PARTNERSHIP">
                          Hospital Partnership
                        </SelectItem>
                        <SelectItem value="GENERAL_FEEDBACK">
                          General Feedback
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your message"
                    disabled={isSubmitting}
                    {...register("subject")}
                  />
                  {errors.subject ? (
                    <p className="text-xs text-destructive">
                      {errors.subject.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Provide details regarding your request or inquiry..."
                    disabled={isSubmitting}
                    {...register("message")}
                  />
                  {errors.message ? (
                    <p className="text-xs text-destructive">
                      {errors.message.message}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Submit Inquiry
                    </>
                  )}
                </Button>

                {submitted ? (
                  <p className="rounded-lg bg-emerald-500/10 p-3 text-center text-xs font-medium text-emerald-800 dark:text-emerald-200">
                    Thank you! Your inquiry was received. We will respond
                    promptly.
                  </p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Operating Details */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Direct Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    LifeLink Central Headquarters
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Level 7, Healthcare Tower, Dhanmondi 27, Dhaka 1209,
                    Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    Email Inquiries
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    General: support@lifelink.org
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hospitals: partners@lifelink.org
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    Operational Hours
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Emergency Hotline & Real-time Matching:{" "}
                    <strong>24/7/365</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Administrative Support: Sun - Thu, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-primary/5 border-primary/20">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2 text-primary font-heading font-semibold">
                <HeartHandshake className="size-5" />
                Hospital & Blood Bank Network
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Are you a licensed hospital, blood transfusion center, or NGO?
                Partner with LifeLink to integrate urgent blood request alerts
                directly with voluntary donors.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href="mailto:partners@lifelink.org">
                  Email Partnership Team
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
