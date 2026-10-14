export default function Logo({ dark = false }) {
  return (
    <span className={`logo ${dark ? 'logo-dark' : ''}`}>
      shop<span className="logo-accent">cart</span>
    </span>
  );
}
