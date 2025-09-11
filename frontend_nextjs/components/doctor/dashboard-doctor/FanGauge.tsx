import React from 'react';
import { Users, Heart } from 'lucide-react';

interface NavbarFanGaugeProps {
  currentFans: number;
  targetFans?: number;
}

const FanGauge: React.FC<NavbarFanGaugeProps> = ({ currentFans, targetFans = 18000 }) => {
  const progressPercentage = Math.min((currentFans / targetFans) * 100, 100);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="flex items-end space-x-1 group relative">
      {/* Icône avec badge */}
      <div className="relative flex-shrink-0">
        <img src="/fan.png" alt="Fan" className="w-7 h-7" />
        {/* <Users className="w-5 h-5 text-gray-600" strokeWidth={2} /> */}
        <Heart
          className="w-3 h-3 text-pink-500 absolute -bottom-0.5 -right-0"
          fill="#FF69B4"
          strokeWidth={2}
        />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col space-y-0.5 min-w-0">
        {/* Barre de progression compacte */}
        <div className="relative">
          <div
            className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={currentFans}
            aria-valuemin={0}
            aria-valuemax={targetFans}
            aria-label={`Fans: ${formatNumber(currentFans)}/${formatNumber(targetFans)}`}
          >
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Compteur compact */}
        <div className="flex items-center space-x-1 text-[10px] font-medium text-gray-700">
          <span className="whitespace-nowrap">
            {formatNumber(currentFans)}/{formatNumber(targetFans)}
          </span>
          <span className="text-gray-500 hidden sm:inline">
            ({progressPercentage.toFixed(0)}%)
          </span>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm w-80">
          {/* Flèche du tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>

          {/* Header */}
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-700">
            <Users className="w-4 h-4 text-pink-400" />
            <h3 className="font-semibold text-sm text-pink-400">Pourquoi développer sa communauté ?</h3>
          </div>

          {/* Avantages */}
          <div className="space-y-3 text-xs">
            <div>
              <h4 className="text-xs font-medium text-white mb-1">🏥 Crédibilité Professionnelle</h4>
              <p className="text-xs text-gray-300">Renforce votre réputation auprès des patients et collègues.</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-white mb-1">💼 Opportunités de Carrière</h4>
              <p className="text-xs text-gray-300">Attire l'attention des recruteurs et ouvre de nouvelles portes.</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-white mb-1">🤝 Réseau Professionnel</h4>
              <p className="text-xs text-gray-300">Facilite les collaborations et échanges avec d'autres experts.</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-white mb-1">📈 Visibilité Médicale</h4>
              <p className="text-xs text-gray-300">Augmente votre influence dans votre domaine de spécialité.</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-white mb-1">🎯 Impact Patient</h4>
              <p className="text-xs text-gray-300">Permet de sensibiliser et éduquer un plus large public.</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-white mb-1">💡 Leadership d'Opinion</h4>
              <p className="text-xs text-gray-300">Établit votre expertise comme référence dans le secteur.</p>
            </div>

            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-lg border border-yellow-300 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">💸</span>
                <h4 className="font-bold text-gray-900 text-sm">Monétisation du Compte</h4>
              </div>
              <p className="text-gray-800 text-xs font-medium leading-relaxed">
                <span className="font-bold text-gray-900">Débloque la monétisation à partir de 18k fans</span>,
                revenus croissants selon les objectifs fixés.
              </p>
              <div className="mt-2 flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-900">Objectif Premium</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-2 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-xs">Objectif : {formatNumber(targetFans)} fans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FanGauge;