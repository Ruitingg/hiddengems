const DiamondIcon = ({ size = 24, color = '#184b44' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="50,5 95,35 50,95 5,35" stroke={color} strokeWidth="5" fill="none"/>
    <polygon points="50,5 75,35 50,35 25,35" stroke={color} strokeWidth="5" fill="none"/>
    <line x1="25" y1="35" x2="50" y2="95" stroke={color} strokeWidth="5"/>
    <line x1="75" y1="35" x2="50" y2="95" stroke={color} strokeWidth="5"/>
    <line x1="50" y1="5" x2="50" y2="35" stroke={color} strokeWidth="5"/>
  </svg>
)

export default DiamondIcon