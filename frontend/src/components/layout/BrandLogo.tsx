type BrandLogoProps = {
  size?: 'sm' | 'lg';
};

export const BrandLogo = ({ size = 'sm' }: BrandLogoProps) => {
  const logoSize = size === 'lg' ? 'h-12 w-12' : 'h-9 w-9';
  const titleSize = size === 'lg' ? 'text-2xl' : 'text-lg';
  const subtitleSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex items-center gap-3">
      <img className={`${logoSize} shrink-0 rounded-md`} src="/logo.svg" alt="Logo SISIA Cloud" />
      <div>
        <h1 className={`${titleSize} font-semibold leading-tight text-slate-950`}>SISIA Cloud</h1>
        <p className={`${subtitleSize} text-slate-500`}>Gestión segura académica</p>
      </div>
    </div>
  );
};
