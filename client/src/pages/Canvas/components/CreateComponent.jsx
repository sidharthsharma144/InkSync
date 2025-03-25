import React from 'react';
import Element from './Element';

const CreateComponente = ({ info, current_component, removeComponent, selectItem, setSelectItem }) => {
    let html = null; // Set default to null

    if (info.name === 'main_frame') {
        html = (
            <div
                onClick={() => {
                    info.setCurrentComponent(info);
                    setSelectItem('');
                }}
                className="hover:border-[2px] hover:border-indigo-500 shadow-md"
                style={{
                    width: (info.width || 300) + 'px', // Default width
                    height: (info.height || 300) + 'px', // Default height
                    background: info.color || 'white', // Default background
                    zIndex: info.z_index || 1, // Default zIndex
                }}
            >
                {info.image && <img className="w-full h-full" src={info.image} alt="main_frame" />}
            </div>
        );
    }

    // Similarly update other conditions...
    if (info.name === 'shape' && info.type === 'rect') {
        html = (
            <div
                id={info.id}
                onClick={() => info.setCurrentComponent(info)}
                style={{
                    opacity: info.opacity || 1,
                    left: (info.left || 0) + 'px',
                    top: (info.top || 0) + 'px',
                    zIndex: info.z_index || 1,
                    transform: info.rotate ? `rotate(${info.rotate}deg)` : 'rotate(0deg)',
                }}
                className={`absolute group hover:border-[2px] ${
                    info.id === selectItem ? 'border-[2px]' : ''
                } border-indigo-500`}
            >
                {selectItem === info.id && <Element id={info.id} info={info} exId={`${info.id}r`} />}
                <div
                    onMouseDown={() => info.moveElement(info.id, info)}
                    id={`${info.id}r`}
                    style={{
                        width: (info.width || 100) + 'px', // Default width
                        height: (info.height || 100) + 'px', // Default height
                        background: info.color || 'gray', // Default color
                    }}
                />
            </div>
        );
    }

    return html;
};

export default CreateComponente;
