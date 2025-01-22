import TaxonomyList from "./taxonomyList";

export default function HomePage() {

  return (
    <>
      <section className="pt-28 pb-28 md:pb-40">
        <h1 className="md:text-2xl text-center px-12 lg:px-32 xl:px-64 2xl:px-96">
          “DES CRÉATIONS TENDRES ET UNIQUES POUR ILLUMINER L'UNIVERS 
          DES MAMANS ET LEURS PETITS TRÉSORS”
        </h1>
      </section>
      <section className="pb-28">
        <TaxonomyList/>
      </section>
    </>
  );
}