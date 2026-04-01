import Icon from "./Icon";

const TRUST_ITEMS = [
  {
    icon: "verified_user",
    title: "200+ Point Check",
    desc: "Thorough editorial inspection",
  },
  {
    icon: "history",
    title: "History Verified",
    desc: "Full transparency guaranteed",
  },
  {
    icon: "support_agent",
    title: "5-Year Support",
    desc: "Post-purchase assistance",
  },
  {
    icon: "payments",
    title: "Easy Financing",
    desc: "EMI from ₹14,000/mo",
  },
];

const TrustGrid = () => (
  <section className="bg-surface-container py-10 px-5 mb-10">
    <div className="grid grid-cols-2 gap-4">
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.title}
          className="bg-surface-container-lowest p-5 rounded-xl text-center editorial-shadow-sm"
        >
          <Icon
            name={item.icon}
            filled
            size={32}
            className="text-primary mb-2.5 block mx-auto"
          />
          <h5 className="font-headline font-bold text-primary text-sm mb-1">
            {item.title}
          </h5>
          <p className="font-body text-[10px] text-on-surface-variant">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default TrustGrid;
