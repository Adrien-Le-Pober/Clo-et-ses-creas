import loader from './../../assets/images/loader.mp4';

export default function Loader() {
    return (
        <div className="flex justify-center items-center h-16">
            <video src={loader} loop autoPlay muted className="w-52"></video>
        </div>
    );
}