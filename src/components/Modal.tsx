import styled from "styled-components";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

interface PhotoModalProps {
    render: (isVisible: boolean) => void;
    photoId: string;
    photoUrl: string;
    photoLikes: number;
}

interface PhotoStatistics {
    downloads: { total: number };
    views: { total: number };
}

const PhotoModal: React.FC<PhotoModalProps> = ({render, photoId, photoUrl, photoLikes}) => {
    const [photoDownloads, setPhotoDownloads] = useState<number>(0);
    const [photoViews, setPhotoViews] = useState<number>(0);
    const photoDivRef = useRef<HTMLDivElement>(null);

    const fetchPhoto = async () => {
        try {
            const response = await axios.get<PhotoStatistics>(`https://api.unsplash.com/photos/${photoId}/statistics`, {
                params: {
                    client_id: 'ihpsdWQhpiIDTs7vDnAerKG89tbc2P77dGvAN9PiZk0',
                },
            });

            setPhotoDownloads(response.data.downloads.total);
            setPhotoViews(response.data.views.total)
        } catch (error) {
            console.error("Failed to fetch photo data", error);
        }
    };

    useEffect(() => {
        fetchPhoto();

        const handleClickOutside = (event: MouseEvent) => {
            if (photoDivRef.current && !photoDivRef.current.contains(event.target as Node)) {
                render(false);
            }
        };

        // Disable scrolling on the body element when the modal is open
        document.body.style.overflow = 'hidden';

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);

            // Re-enable scrolling when the modal is closed
            document.body.style.overflow = '';
        };
    }, [render]);

    
    return (
        <Modal>
            <PhotoDiv ref={photoDivRef}>
                <Img src={photoUrl}/>
                <DataDiv>
                <Data>გადმოწერების რაოდენობა: 
                    <Count>
                        {photoDownloads}
                    </Count>
                </Data>

                <Data>ნახვების რაოდენობა: 
                    <Count>
                        {photoViews}
                    </Count>
                </Data>

                <Data>მოწონებების რაოდენობა: 
                    <Count>
                        {photoLikes}
                    </Count>
                </Data>
                </DataDiv>
            </PhotoDiv>
        </Modal>
    );
}
 
export default PhotoModal;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
    max-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    background-color: rgba(251, 251, 251, 0.3);
`

const PhotoDiv = styled.div`
    display: flex;
    background-color: #fff;
    border-radius: 8px;
`

const Img = styled.img`
    height: 400px;
    width: 330px;
    border-radius: 8px;
    overflow: hidden;
    object-fit: cover;
` 

const DataDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding: 40px;
`

const Data = styled.p`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 25px;
    color: #323334;
    font-weight: 600;
`

const Count = styled.p`
    font-size: 25px;
    color: #03a9f4;
    font-weight: 700;
`