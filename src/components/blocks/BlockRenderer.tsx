import React from "react";
import dynamic from "next/dynamic";

// 1. Dynamic Imports for Performance (Lazy Loading)
// Next.js will ONLY download the component code if the Theme dictates it!
const Header         = dynamic(() => import("./Header").catch(()         => () => <Placeholder name="Header" />));
const Footer         = dynamic(() => import("./Footer").catch(()         => () => <Placeholder name="Footer" />));
const SimpleSlider   = dynamic(() => import("./SimpleSlider").catch(()   => () => <Placeholder name="Simple Slider" />));
const AdvanceSlider  = dynamic(() => import("./AdvanceSlider").catch(()  => () => <Placeholder name="Advance Slider" />));
const AboutUs        = dynamic(() => import("./AboutUs").catch(()        => () => <Placeholder name="About Us" />));
const PortfolioClients  = dynamic(() => import("./PortfolioClients").catch(()  => () => <Placeholder name="Portfolio Clients" />));
const PortfolioSponsors = dynamic(() => import("./PortfolioSponsors").catch(() => () => <Placeholder name="Portfolio Sponsors" />));
const PortfolioEvents   = dynamic(() => import("./PortfolioEvents").catch(()   => () => <Placeholder name="Portfolio Events" />));
const Gallery        = dynamic(() => import("./Gallery").catch(()        => () => <Placeholder name="Gallery" />));
const Testimonial    = dynamic(() => import("./Testimonial").catch(()    => () => <Placeholder name="Testimonial" />));
const SubscriptionPlans = dynamic(() => import("./SubscriptionPlans").catch(() => () => <Placeholder name="Subscription Plans" />));
const ContactUs      = dynamic(() => import("./ContactUs").catch(()      => () => <Placeholder name="Contact Us" />));

function Placeholder({ name }: { name: string }) {
  return (
    <div className="w-full h-32 border-2 border-dashed border-muted bg-muted/20 flex flex-col items-center justify-center text-muted-foreground my-4">
      <p className="text-sm font-semibold">{name} Component</p>
      <p className="text-xs">Component file not found or still in development.</p>
    </div>
  );
}

export interface BlockRendererProps {
  block_type: string;
  visible: boolean;
  settings?: Record<string, any>;
  vendorData?: any; // The raw data payload from the API representing the vendor stats/images
}

export default function BlockRenderer({ block_type, visible, settings, vendorData }: BlockRendererProps) {
  // If the admin hid this block in the Theme Builder, skip rendering entirely!
  if (!visible) return null;

  // The Switch Statement maps the Database String to the React Code
  // And passes the *Variant Settings* + *Real Vendor Data* down to the component.
  switch (block_type) {
    case "header":
      return <Header data={vendorData} settings={settings} />;

    case "footer":
      return <Footer data={vendorData} settings={settings} />;

    case "simple_slider":
      return <SimpleSlider data={vendorData} settings={settings} />;

    case "advance_slider":
      return <AdvanceSlider data={vendorData} settings={settings} />;

    case "about_us":
      // Map Classic variant to variant_1 to prevent falling through if admin used 'Classic' as key
      const aboutVariant = settings?.variant === "Classic" ? "variant_1" : settings?.variant;
      return <AboutUs data={vendorData} settings={{ ...settings, variant: aboutVariant }} />;

    case "terms_conditions":
      // Not rendered as a page section — accessible only via /{slug}/terms-conditions and footer quick link
      return null;

    case "privacy_policy":
      // Not rendered as a page section — accessible only via /{slug}/privacy-policy and footer quick link
      return null;

    case "social_media":
      // Handled globally in Footer, ignored in body blocks
      return null;

    case "register":
      // Used by header CTA visibility only.
      return null;

    case "portfolio_clients":
      return <PortfolioClients data={vendorData} settings={settings} />;
      
    case "portfolio_sponsors":
      return <PortfolioSponsors data={vendorData} settings={settings} />;
      
    case "portfolio_events":
      return <PortfolioEvents data={vendorData} settings={settings} />;
      
    case "gallery":
      return <Gallery data={vendorData} settings={settings} />;
      
    case "testimonial":
      return <Testimonial data={vendorData} settings={settings} />;
      
    case "subscription":
      return <SubscriptionPlans data={vendorData} settings={settings} />;

    case "contact_us":
      return <ContactUs data={vendorData} settings={settings} />;

    default:
      // Graceful fallback for unmapped or new blocks
      return (
        <div className="w-full p-4 border border-red-500/50 bg-red-500/10 text-red-600 text-center text-xs my-2 rounded">
           Unrecognized Block Type: {block_type}
        </div>
      );
  }
}
