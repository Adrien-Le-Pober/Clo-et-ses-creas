import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PlaceIcon from '@mui/icons-material/Place';
import instagram from '../../assets/images/instagram.png';

export default function footer() {
    return (
        <footer className="bottom-0 left-0 bg-primary text-secondary w-full p-12">
            <section className="flex flex-col xl:flex-row">
                <div className="xl:w-1/3">
                    <h3 className="text-4xl">Clo et ses Créas</h3>
                    <div className="flex pt-8">
                        <img src={instagram} alt="instagram" width="40" className="mx-6" />
                        <p className="text-2xl">les_creasbyclo</p>
                    </div>
                </div>
                <div className="xl:w-1/3">
                    <h3 className="text-4xl mt-16 xl:mt-0">Contact</h3>
                    <div>
                        <div className="flex pt-8">
                            <PlaceIcon className="text-4xl mx-6"/>
                            <p className="text-2xl">86000 Poitiers</p>
                        </div>
                        <div className="flex pt-8">
                            <MailOutlineIcon className="text-4xl mx-6"/>
                            <p className="text-2xl">clotildedaumy@gmail.com</p>
                        </div>
                        <div className="flex pt-8">
                            <PhoneIcon className="text-4xl mx-6"/>
                            <p className="text-2xl">06 29 92 33 85</p>
                        </div>
                    </div>
                </div>
                <div className="xl:w-1/3">
                    <h3 className="text-4xl mt-16 xl:mt-0">Informations</h3>
                    <div className="pt-8 ms-6 text-2xl">
                        <p>Suivi de commande</p>
                        <p>Livraison</p>
                        <p>Retours</p>
                        <p>Plan du site</p>
                    </div>
                </div>
            </section>
            <section className="mt-36">
                <div className="flex justify-center text-sm">
                    Politique de confidentialité
                        -   
                    Politique de confidentialité
                        -   
                    Politique de remboursement
                        -   
                    Politique d'expédition
                        -   
                    Conditions générales de vente
                        -   
                    Mentions légales
                        -   
                    Conditions d'utilisation
                </div>
            </section>
        </footer>
    );
}