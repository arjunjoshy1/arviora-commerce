import Logo from '../../../components/Logo';

const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
      <Logo />
      <p>© {new Date().getFullYear()} Arviora. Thoughtfully sourced.</p>
    </div>
  </footer>
);

export default Footer;
