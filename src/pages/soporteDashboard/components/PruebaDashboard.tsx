import type React from "react";

export const PruebaDashboard: React.FC = () => {

    return (
        <div>
            <div className="e-card ">
                <div className="e-card-header">
                    <div className="e-card-header-image football e-card-corner" />
                    <div className="e-card-header-caption ">
                        <div className="w-25 h-10 bg-gradient-to-r  from-[#70455B]  to-purple-500 
                        rounded-xl flex items-center
                        justify-center shadow-lg shadow-[#70455B]/25 animate-float">
                            <div className="e-card-header-title text-white font-bold text-lg"
                            > Laura Callahan</div>
                        </div>

                        <div className="e-card-sub-title">Sales Coordinator and Representative</div>
                    </div>
                </div>
            </div>
            <div className="e-card">
                <div className="e-card-header">
                    <div className="e-card-header-caption">
                        <div className="e-card-header-title "> Laura Callahan</div>
                        <div className="e-card-sub-title">Sales Coordinator and Representative</div>
                    </div>
                    <div className="e-card-header-image football" />
                </div>
            </div>
        </div>
    );
};