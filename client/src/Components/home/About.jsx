import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-main">
      <h2 className="about-head">About</h2>
      <div className="about about-1">
        <h3>What the Website Does</h3>
        <p>This website is designed exclusively for IIT Kanpur students to explore
        anonymous yet meaningful connections. Students sign up using their roll
        number and answer a set of questions about their dating preferences.
        Based on their responses, they receive personalized recommendations for
        potential matches. Users can search for members of the opposite gender,
        apply filters based on batch, department, and match percentage, and
        initiate conversations without revealing their identity.</p>
      </div>
      <div className="about about-2">
        <h3>Motive of the Website</h3>
        <p>The primary goal of this platform is to foster a safe, inclusive, and
        engaging environment where IIT Kanpur students can explore dating and
        friendships without fear of judgment. By ensuring anonymity and control
        over identity revelation, the website empowers users to interact more
        freely and genuinely. The platform aims to break the ice in a highly
        academic environment and help students form connections based on mutual
        interests and compatibility.</p>
      </div>
      <div className="about about-3">
        <h3>How the Website Simplifies Dating at IIT Kanpur</h3>
        <p>Dating in a close-knit, academically focused environment like IIT Kanpur
        can be challenging. This website simplifies the process by: Anonymity
        with Control: Users can engage in conversations without the pressure of
        immediate identity disclosure, offering a safe space to interact.
        Tailored Recommendations: Personalized suggestions based on preferences
        ensure that users find compatible matches effortlessly. Smart Filters:
        The ability to filter by batch, department, and match percentage
        enhances the search experience, making it easy to find like-minded
        individuals. Identity Management: Users have full control over revealing
        their identity, maintaining privacy while allowing meaningful
        connections to flourish.</p>
      </div>
      <div className="about about-4">
        <h3>Features and Benefits</h3>
        <p>Anonymous Messaging: Initiate conversations without revealing who you
        are. Request for Identity Reveal: Choose to reveal your details only
        when you feel comfortable. User Preferences and Match Percentage:
        Discover people who align with your values and interests. Customizable
        Profiles: Edit your profile anytime to reflect changes in preferences.
        Notifications and Settings: Stay updated with messages and customize
        your experience through various settings.</p>
      </div>
      <div className="about about-5">
        <h3> Security and Moderation</h3>
        <p>To ensure a respectful and safe environment, the platform provides
        robust security features: Block and Report Abuse: Users can block and
        report any inappropriate or abusive behavior directly through the chat
        interface. Admin Moderation: Reported users are reviewed by the admin,
        and accounts found violating community guidelines can be restricted or
        banned, ensuring a safer community for everyone.</p>
      </div>
    </div>
  );
}

export default About;
