import React, { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from "react-router-dom";

import { FiPlus } from "react-icons/fi";

import Sidebar from '../components/Sidebar';

import '../styles/pages/create-orphanage.css';

import mapIcon from '../utils/mapIcon';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import api from "../services/api";

interface OrphanageForm {
    name: string;
    about: string;
    instructions: string;
    opening_hours: string;
    open_on_weekends: boolean;
}

export default function CreateOrphanage() {
    const history = useHistory();

    const [position, setPosition] = useState({latitude: 0, longitude: 0});
    const [orphanageForm, setOrphanageForm] = useState<OrphanageForm>({
      name: '',
      about: '',
      instructions: '',
      opening_hours: '',
      open_on_weekends: true
    });
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    function handleMapClick(event: LeafletMouseEvent) {
        const {lat, lng} = event.latlng
        setPosition({
            latitude: lat,
            longitude: lng
        })
    }

    const handleOnChangeOrphanageForm = (key: any, value: any) => {
        setOrphanageForm({ ...orphanageForm, [key]: value });
    };

    const handleSelectImages = (event: ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files){
            return;
        }

        const selectedImages = Array.from(event.target.files);

        setImages(selectedImages);

        const selectedImagesPreview = selectedImages.map(image => {
            return URL.createObjectURL(image);
        });

        setPreviewImages(selectedImagesPreview);


    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const {latitude, longitude} = position;
        const data = new FormData();

        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('name', orphanageForm.name);
        data.append('about', orphanageForm.about);
        data.append('instructions', orphanageForm.instructions);
        data.append('opening_hours', orphanageForm.opening_hours);
        data.append('open_on_weekends', String(orphanageForm.open_on_weekends));

        images.forEach(image => {
            data.append('images', image);
        });

        await api.post('/orphanages', data);

        alert('Cadastro realizado com sucesso!');

        history.push('/app');
    }

    return (
        <div id="page-create-orphanage">
            <Sidebar />

            <main>
                <form className="create-orphanage-form" onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Dados</legend>

                        <Map
                            center={[-20.1540336, -44.9159928]}
                            style={{ width: '100%', height: 280 }}
                            zoom={15}
                            onclick={handleMapClick}
                        >
                            <TileLayer
                                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                            />

                            {position.latitude !== 0 && (
                                <Marker 
                                    interactive={false} 
                                    icon={mapIcon} 
                                    position={[
                                        position.latitude,
                                        position.longitude
                                    ]} 
                                />
                            )}
                        </Map>

                        <Input 
                            name="name" 
                            label="Nome" 
                            value={orphanageForm.name} 
                            required
                            onChange={(e: any) => handleOnChangeOrphanageForm('name', e.target.value)}
                        />

                        <Textarea 
                            name="about" 
                            label="Sobre <span>Máximo de 300 caracteres</span>" 
                            required
                            value={orphanageForm.about} 
                            onChange={(e: any) => handleOnChangeOrphanageForm('about', e.target.value)}
                        />

                        <div className="input-block">
                            <label htmlFor="images">Fotos</label>

                            <div className="images-container">
                                {previewImages.map(image => {
                                    return (
                                        <img key={image} src={image} alt={orphanageForm.name} />
                                    )
                                })}
                                <label
                                    htmlFor="image[]"
                                    className="new-image"
                                >
                                    <FiPlus size={24} color="#15b6d6" />
                                </label>
                            </div>

                            <input multiple onChange={handleSelectImages} type="file" className="images-input" id="image[]"/>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Visitação</legend>

                        <Textarea 
                            name="instructions" 
                            label="Instruções" 
                            required
                            value={orphanageForm.instructions} 
                            onChange={(e: any) => handleOnChangeOrphanageForm('instructions', e.target.value)}
                        />

                        <Input 
                            name="opening_hours" 
                            label="Opening Hours" 
                            value={orphanageForm.opening_hours} 
                            required
                            onChange={(e: any) => handleOnChangeOrphanageForm('opening_hours', e.target.value)}
                        />

                        <div className="input-block">
                            <label htmlFor="open_on_weekends">Atende fim de semana</label>

                            <div className="button-select">
                                <button 
                                    type="button" 
                                    className={orphanageForm.open_on_weekends ? 'active' : ''}
                                    onClick={() => handleOnChangeOrphanageForm('open_on_weekends', true)}
                                >
                                    Sim
                                </button>
                                <button 
                                    type="button"
                                    className={orphanageForm.open_on_weekends ? '' : 'active'}
                                    onClick={() => handleOnChangeOrphanageForm('open_on_weekends', false)}
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </fieldset>

                    <button className="confirm-button" type="submit">
                        Confirmar
                    </button>
                </form>
            </main>
        </div>
    );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
