import Clotilde from '../../assets/images/Clotilde.jpg';

export default function MyStoryPage() {
    return (
        <>
            <div className="flex justify-center  md:justify-start">
                <div className="md:w-1/2"></div>
                <h1 className="pb-28 pt-20 md:pb-24 md:pt-32 text-4xl">Qui suis-je ?</h1>
            </div>
            <div className="flex flex-col md:flex-row">
                <section className="w-full px-6 md:px-12 text-3xl pb-16">
                    <img
                        src={Clotilde}
                        alt="Photo de Clotilde Daumy"
                        className="hidden md:block md:w-1/2 md:float-left pe-16"
                    />
                    <p>Bienvenue dans mon univers de couture sur-mesure !</p>
                    <br/>
                    <p>Passionnée par la couture et l'art du fait main, C'est avec une simple machine à coudre et une grande dose de curiosité que mon aventure dans la couture a commencé en 2020.</p>
                    <br/>
                    <p>Autodidacte, j'ai appris à manier les tissus, à perfectionner mes techniques et à donner vie à mes idées à force de patience d'expérimentations et de passion. Chaque création est le fruit de nombreuses heures de pratique et d'une envie constante de m'améliorer, c'est pour cela que j'ai décidé de lancer mon site internet "les créas de Clo" pour offrir des créations uniques et délicates, pensées avec amour pour les bébés et les femmes.</p>
                    <br/>
                    <p>Chaque pièce est confectionnée avec soin, dans des matières douces, de qualité, et respectueuses de la peau, que ce soit pour célébrer les premiers instants de la vie d'un bébé, offrir ou simplement se faire plaisir !</p>
                    <br/>
                    <p>Merci de votre visite et de votre soutien dans cette nouvelle aventure, j'ai hâte de vous accompagner avec mes créations personnalisées et pleines de tendresse.</p>
                    <br/>
                    <p>Merci de faire partie de cette belle aventure.</p>
                    <br/>
                    <p>À très vite !</p>
                    <img
                        src={Clotilde}
                        alt="Photo de Clotilde Daumy"
                        className="md:hidden w-full mx-auto pt-6"
                    />
                </section>
            </div>
        </>
    );
}