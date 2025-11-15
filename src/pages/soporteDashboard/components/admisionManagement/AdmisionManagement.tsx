import { MenuComponent } from '@syncfusion/ej2-react-navigations'
import React from 'react'

export const AdmisionManagement: React.FC = () => {

    let menuItems = [
        {
            items: [
                { text: 'Open' },
                { text: 'Save' },
                { text: 'Exit' }
            ],
            text: 'File'
        },
        {
            items: [
                { text: 'Cut' },
                { text: 'Copy' },
                { text: 'Paste' }
            ],
            text: 'Edit'
        },
        {
            items: [
                { text: 'Toolbar' },
                { text: 'Sidebar' }
            ],
            text: 'View'
        },
        {
            items: [
                { text: 'Spelling & Grammar' },
                { text: 'Customize' },
                { text: 'Options' }
            ],
            text: 'Tools'
        },
        { text: 'Go' },
        { text: 'Help' }
    ];

    return (
        <>
            <div className='flex flex-1'>
                <div className='w-64 bg-gray-100 border-r'>

                    a
                </div>
            </div>
            <MenuComponent items={menuItems} />
        </>
    )
}
