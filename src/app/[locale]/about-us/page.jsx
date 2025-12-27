import CryptoBg from "./CryptoBg";
import BrandIdeology from "./BrandIdeology";
import ProductsServ from "./ProductsServ";
export default function Company() {
  return (
    <div className="flex bg-black lg:gap-[240px] gap-[80px] flex-col items-center justify-center w-full">
      <CryptoBg />
      <BrandIdeology />
      <ProductsServ />
    </div>
  );
}