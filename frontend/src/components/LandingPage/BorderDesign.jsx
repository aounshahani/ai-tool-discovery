// import React from 'react';

// // Define the exact faint orange color derived from the primary color (opacity 10%)
// const FAINT_ORANGE = 'rgba(255, 107, 59, 0.1)';
// const BASE_ORANGE_COLOR = 'rgba(255, 84, 31, 0.69)'; // The specific semi-transparent orange from CSS

// /**
//  * Component for the tall, rounded rectangular border design (Hero/CTA sections).
//  * These elements are typically placed on the left/right edges of a section.
//  * @param {string} position 'left' or 'right' to control positioning.
//  */
// const RoundedBoxBorder = ({ position }) => {
//     const baseStyle = {
//         position: 'absolute',
//         backgroundColor: FAINT_ORANGE,
//         zIndex: 0,
//         width: '200px',
//         height: '400px',
//         pointerEvents: 'none',
//         // Note: top position is intentionally left to be determined by the parent section
//     };

//     const specificStyle = position === 'left'
//         ? { left: 0, top: 0, borderTopRightRadius: '50px', borderBottomRightRadius: '50px' }
//         : { right: 0, top: 0, borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' };

//     return (
//         <div 
//             style={{ ...baseStyle, ...specificStyle }}
//         />
//     );
// };


// /**
//  * Component for the large, circular border design (Plans/FAQ sections).
//  * These are off-screen circles creating a crescent effect, positioned relative to their section.
//  * @param {string} position 'left' or 'right' to control its off-screen position.
//  */
// const LargeCircularBorder = ({ position }) => {
//     const baseStyle = {
//         position: 'absolute',
//         backgroundColor: FAINT_ORANGE,
//         zIndex: 0,
//         width: '800px',
//         height: '800px',
//         borderRadius: '50%',
//         pointerEvents: 'none',
//     };

//     // Positions relative to the containing section (which is itself positioned absolutely on the page)
//     const specificStyle = position === 'left'
//         ? { top: '10px', left: '-200px' } 
//         : { top: 0, right: '-400px' }; 

//     return (
//         <div 
//             style={{ ...baseStyle, ...specificStyle }}
//         />
//     );
// };

// /**
//  * Component for the Full-Height Border Design (CTA section).
//  * Spans 100% height of the parent.
//  * @param {string} position 'left' or 'right'
//  */
// const FullHeightRoundedBorder = ({ position }) => {
//     const baseStyle = {
//         position: 'absolute',
//         backgroundColor: FAINT_ORANGE,
//         zIndex: 0,
//         width: '200px',
//         height: '100%',
//         top: 0,
//         pointerEvents: 'none',
//     };

//     const specificStyle = position === 'left'
//         ? { left: 0, borderTopRightRadius: '50px', borderBottomRightRadius: '50px' }
//         : { right: 0, borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' };

//     return (
//         <div 
//             style={{ ...baseStyle, ...specificStyle }}
//         />
//     );
// };

// /**
//  * Component for a faint, tall orange box (Top left, Hero section).
//  * CSS: width: 319px; height: 600px; left: 54px; top: 158px; opacity: 0.35;
//  */
// const LeftSideHeroFaintBox = () => {
//     return (
//         <div
//             className="absolute z-0 rounded-xl pointer-events-none"
//             style={{
//                 width: '319px',
//                 height: '600px',
//                 left: '54px', 
//                 top: '158px', 
//                 backgroundColor: BASE_ORANGE_COLOR,
//                 opacity: 0.35,
//                 borderRadius: '10px',
//             }}
//         />
//     );
// };


// /**
//  * Component for a faint, central orange box (Center, Hero section).
//  * CSS: width: 319px; height: 553px; left: 561px; top: 158px; opacity: 0.22;
//  */
// const CentralFaintOrangeBox = () => {
//     return (
//         <div
//             className="absolute z-0 rounded-xl pointer-events-none"
//             style={{
//                 width: '319px',
//                 height: '553px',
//                 left: '561px', 
//                 top: '158px', 
//                 backgroundColor: BASE_ORANGE_COLOR,
//                 opacity: 0.22, 
//                 borderRadius: '10px',
//             }}
//         />
//     );
// };


// /**
//  * Component for a faint, tall orange box (Top right, Hero section).
//  * CSS: width: 319px; height: 600.2px; left: 1068px; top: 158px; opacity: 0.22;
//  */
// const RightSideHeroFaintBox = () => {
//     return (
//         <div
//             className="absolute z-0 rounded-xl pointer-events-none"
//             style={{
//                 width: '319px',
//                 height: '600.2px',
//                 left: '1068px', 
//                 top: '158px', 
//                 backgroundColor: BASE_ORANGE_COLOR,
//                 opacity: 0.22,
//                 borderRadius: '10px',
//             }}
//         />
//     );
// };


// /**
//  * Component for a large, tall, faint orange box used as a background accent.
//  * Positions are globally absolute.
//  * CSS (Tall columns in Tools section): width: 101px; height: 1817px; top: 989px; opacity: 0.35;
//  * CSS (Tall columns in CTA section): width: 101px; height: 1060px; top: 4024px; opacity: 0.35;
//  *
//  * @param {number} top - Global Y position (e.g., 989 or 4024).
//  * @param {number} height - Height in pixels (e.g., 1817 or 1060).
//  * @param {string} side - 'left' or 'right' to control horizontal placement.
//  */
// const TallSectionFaintBox = ({ top, height, side = 'right' }) => {
//     // Determine horizontal position
//     const horizontalPosition = side === 'left'
//         ? { left: '54px' } 
//         : { left: '1284px' };

//     return (
//         <div 
//             className="pointer-events-none"
//             style={{ 
//                 position: 'absolute',
//                 width: '101px',
//                 height: `${height}px`,
//                 top: `${top}px`, // Uses dynamic top position
//                 backgroundColor: BASE_ORANGE_COLOR,
//                 opacity: 0.35,
//                 borderRadius: '10px',
//                 zIndex: 0,
//                 ...horizontalPosition 
//             }}
//         />
//     );
// };

// /**
//  * Component for the large, rotated, rounded border stroke design.
//  * CSS: left: -113px; top: 2801px;
//  */
// const RotatedCurvedBorder = () => {
//     const BORDER_COLOR = '#FF9777'; 

//     return (
//         <div
//             className="pointer-events-none"
//             style={{
//                 boxSizing: 'border-box',
//                 position: 'absolute',
//                 width: '423.22px',
//                 height: '226.26px',
//                 left: '-113px',
//                 top: '2801px', // Global absolute top position
//                 zIndex: 0,
//                 border: '23.4471px solid ' + BORDER_COLOR,
//                 borderRadius: '117.235px',
//                 transform: 'rotate(90deg)',
//             }}
//         />
//     );
// };


// /**
//  * Component for a large, thick, off-screen circular border stroke.
//  * CSS: right: -339.49px; top: calc(50% + 206.005px);
//  */
// const RightCrescentBorder = () => {
//     const BORDER_COLOR = '#FF541F';
//     // The calculation top: calc(50% - 445.49px/2 + 428.75px) simplified to calc(50% + 206.005px)
//     const CALCULATED_TOP = `calc(50% + 206.005px)`; 

//     return (
//         <div
//             className="pointer-events-none"
//             style={{
//                 boxSizing: 'border-box',
//                 position: 'absolute',
//                 width: '445.49px',
//                 height: '445.49px',
//                 right: '-339.49px',
//                 top: CALCULATED_TOP, // Global absolute position
//                 zIndex: 0,
//                 border: '23.4471px solid ' + BORDER_COLOR,
//                 borderRadius: '1172.35px', 
//             }}
//         />
//     );
// };


// export { 
//     RoundedBoxBorder, 
//     LargeCircularBorder, 
//     FullHeightRoundedBorder,
//     LeftSideHeroFaintBox, // New addition for the top-left box
//     RightSideHeroFaintBox, 
//     CentralFaintOrangeBox, 
//     TallSectionFaintBox, 
//     RotatedCurvedBorder, 
//     RightCrescentBorder
// };

// import React from 'react';

// // Define the exact faint orange color derived from the primary color (opacity 10%)
// const FAINT_ORANGE = 'rgba(255, 107, 59, 0.1)';
// const BASE_ORANGE_COLOR = 'rgba(255, 84, 31, 0.69)'; // The specific semi-transparent orange from CSS

// /**
//  * Component for the tall, rounded rectangular border design (Hero/CTA sections).
//  * These elements are typically placed on the left/right edges of a section (position: relative).
//  * They rely on being placed in a parent with relative or absolute positioning.
//  * @param {string} position 'left' or 'right' to control positioning.
//  */
// const RoundedBoxBorder = ({ position }) => {
//     const baseStyle = {
//         position: 'absolute',
//         backgroundColor: FAINT_ORANGE,
//         zIndex: 0,
//         width: '200px',
//         height: '400px',
//         pointerEvents: 'none',
//         // 'top: 0' keeps it aligned with the top of the container it's placed in
//         top: 0,
//     };

//     const specificStyle = position === 'left'
//         ? { left: 0, borderTopRightRadius: '50px', borderBottomRightRadius: '50px' }
//         : { right: 0, borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' };

//     return (
//         <div
//             style={{ ...baseStyle, ...specificStyle }}
//         />
//     );
// };


// /**
//  * Component for the large, circular border design (Plans/FAQ sections).
//  * These are off-screen circles creating a crescent effect, positioned relative to their section.
//  * @param {string} position 'left' or 'right' to control its off-screen position.
//  */
// const LargeCircularBorder = ({ position }) => {
//     const baseStyle = {
//         position: 'absolute',
//         backgroundColor: FAINT_ORANGE,
//         zIndex: 0,
//         width: '800px',
//         height: '800px',
//         borderRadius: '50%',
//         pointerEvents: 'none',
//         top: 0,
//     };

//     // Positions relative to the containing section (which must be position: relative)
//     const specificStyle = position === 'left'
//         ? { top: '10px', left: '-200px' }
//         : { top: 0, right: '-400px' };

//     return (
//         <div
//             style={{ ...baseStyle, ...specificStyle }}
//         />
//     );
// };

// /**
//  * Component for the Full-Height Border Design (CTA section).
//  * Spans 100% height of the parent.
//  * @param {string} position 'left' or 'right'
//  */
// const FullHeightRoundedBorder = ({ position }) => {
//     const baseStyle = {
//         position: 'absolute',
//         backgroundColor: FAINT_ORANGE,
//         zIndex: 0,
//         width: '200px',
//         height: '100%',
//         top: 0,
//         pointerEvents: 'none',
//     };

//     const specificStyle = position === 'left'
//         ? { left: 0, borderTopRightRadius: '50px', borderBottomRightRadius: '50px' }
//         : { right: 0, borderTopLeftRadius: '50px', borderBottomLeftRadius: '50px' };

//     return (
//         <div
//             style={{ ...baseStyle, ...specificStyle }}
//         />
//     );
// };

// // --- Globally positioned, fixed-coordinate background elements ---

// /**
//  * Component for a faint, tall orange box (Top left, Hero section).
//  * Global position: left: 54px; top: 158px; width: 319px; height: 600px;
//  */
// const LeftSideHeroFaintBox = () => {
//     return (
//         <div
//             className="absolute z-0 rounded-xl pointer-events-none"
//             style={{
//                 width: '319px',
//                 height: '600px',
//                 left: '54px',
//                 top: '158px',
//                 backgroundColor: BASE_ORANGE_COLOR,
//                 opacity: 0.35,
//                 borderRadius: '10px',
//             }}
//         />
//     );
// };


// /**
//  * Component for a faint, central orange box (Center, Hero section).
//  * Global position: left: 561px; top: 158px; width: 319px; height: 553px;
//  */
// const CentralFaintOrangeBox = () => {
//     return (
//         <div
//             className="absolute z-0 rounded-xl pointer-events-none"
//             style={{
//                 width: '319px',
//                 height: '553px',
//                 left: '561px',
//                 top: '158px',
//                 backgroundColor: BASE_ORANGE_COLOR,
//                 opacity: 0.22,
//                 borderRadius: '10px',
//             }}
//         />
//     );
// };


// /**
//  * Component for a faint, tall orange box (Top right, Hero section).
//  * Global position: left: 1068px; top: 158px; width: 319px; height: 600.2px;
//  */
// const RightSideHeroFaintBox = () => {
//     return (
//         <div
//             className="absolute z-0 rounded-xl pointer-events-none"
//             style={{
//                 width: '319px',
//                 height: '600.2px',
//                 left: '1068px',
//                 top: '158px',
//                 backgroundColor: BASE_ORANGE_COLOR,
//                 opacity: 0.22,
//                 borderRadius: '10px',
//             }}
//         />
//     );
// };


// /**
//  * Component for a large, tall, faint orange box used as a background accent.
//  * This component's use requires explicit top and height props in the parent component 
//  * because it's used for multiple different vertical positions and heights in the design.
//  *
//  * @param {string} side - 'left' or 'right' to control horizontal placement.
//  * @param {number} top - Global Y position (e.g., 989 or 4024).
//  * @param {number} height - Height in pixels (e.g., 1817 or 1060).
//  */
// const TallSectionFaintBox = ({ top, height, side = 'right' }) => {
//     // Determine horizontal position based on the provided CSS coordinates
//     const horizontalPosition = side === 'left'
//         ? { left: '54px' }
//         : { left: '1284px' };

//     return (
//         <div
//             className="pointer-events-none"
//             style={{
//                 position: 'absolute',
//                 width: '101px',
//                 height: `${height}px`, // Dynamic height
//                 top: `${top}px`, // Dynamic global top position
//                 backgroundColor: BASE_ORANGE_COLOR,
//                 opacity: 0.35,
//                 borderRadius: '10px',
//                 zIndex: 0,
//                 ...horizontalPosition
//             }}
//         />
//     );
// };

// /**
//  * Component for the large, rotated, rounded border stroke design.
//  * Global position: left: -113px; top: 2801px;
//  */
// const RotatedCurvedBorder = () => {
//     const BORDER_COLOR = '#FF9777';

//     return (
//         <div
//             className="pointer-events-none"
//             style={{
//                 boxSizing: 'border-box',
//                 position: 'absolute',
//                 width: '423.22px',
//                 height: '226.26px',
//                 left: '-200px',
//                 top: '4120px', // Global absolute top position
//                 zIndex: 0,
//                 border: '23.4471px solid ' + BORDER_COLOR,
//                 borderRadius: '117.235px',
//                 transform: 'rotate(90deg)',
//             }}
//         />
//     );
// };


// /**
//  * Component for a large, thick, off-screen circular border stroke.
//  * Global position: right: -339.49px; top: calc(50% + 206.005px);
//  */
// const RightCrescentBorder = () => {
//     const BORDER_COLOR = '#FF541F';
//     const CALCULATED_TOP = `calc(50% + 600px)`;

//     return (
//         <div
//             className="pointer-events-none"
//             style={{
//                 boxSizing: 'border-box',
//                 position: 'absolute',
//                 width: '445.49px',
//                 height: '445.49px',
//                 right: '-339.49px',
//                 top: CALCULATED_TOP, // Global absolute position
//                 zIndex: 0,
//                 border: '23.4471px solid ' + BORDER_COLOR,
//                 borderRadius: '1172.35px',
//             }}
//         />
//     );
// };


// export {
//     RoundedBoxBorder,
//     LargeCircularBorder,
//     FullHeightRoundedBorder,
//     LeftSideHeroFaintBox,
//     RightSideHeroFaintBox,
//     CentralFaintOrangeBox,
//     TallSectionFaintBox,
//     RotatedCurvedBorder,
//     RightCrescentBorder
// };

import React from 'react';

const FAINT_ORANGE = 'rgba(255, 107, 59, 0.1)';
const BASE_ORANGE_COLOR = 'rgba(255, 84, 31, 0.69)';

// --- Hero Section Borders ---

export const LeftSideHeroFaintBox = () => (
    <div
        className="absolute z-0 rounded-xl pointer-events-none hidden xl:block"
        style={{
            width: '319px',
            height: '600px',
            left: '54px',
            top: '0', // Changed from fixed 158px to 0 relative to section
            backgroundColor: BASE_ORANGE_COLOR,
            opacity: 0.35,
            borderRadius: '10px',
        }}
    />
);

export const CentralFaintOrangeBox = () => (
    <div
        className="absolute z-0 rounded-xl pointer-events-none hidden xl:block"
        style={{
            width: '319px',
            height: '553px',
            left: '50%', // Centered
            marginLeft: '-159px', // Half width to center
            top: '0',
            backgroundColor: BASE_ORANGE_COLOR,
            opacity: 0.22,
            borderRadius: '10px',
        }}
    />
);

export const RightSideHeroFaintBox = () => (
    <div
        className="absolute z-0 rounded-xl pointer-events-none hidden xl:block"
        style={{
            width: '319px',
            height: '600px',
            right: '54px', // Changed to right aligned
            top: '0',
            backgroundColor: BASE_ORANGE_COLOR,
            opacity: 0.22,
            borderRadius: '10px',
        }}
    />
);

// --- Tools Section Borders ---

export const TallSectionFaintBox = ({ side = 'right' }) => {
    const style = side === 'left' ? { left: '54px' } : { right: '54px' }; // Using right instead of fixed left pixel

    return (
        <div
            className="pointer-events-none absolute hidden 2xl:block"
            style={{
                width: '101px',
                height: '100%', // Full height of container
                top: '0',
                backgroundColor: BASE_ORANGE_COLOR,
                opacity: 0.35,
                borderRadius: '10px',
                zIndex: 0,
                ...style
            }}
        />
    );
};

// --- Pricing Section Border ---

export const RotatedCurvedBorder = () => {
    const BORDER_COLOR = '#FF9777';
    return (
        <div
            className="pointer-events-none absolute hidden xl:block"
            style={{
                boxSizing: 'border-box',
                width: '423px',
                height: '226px',
                left: '-120px', // Relative to section
                top: '20%',     // Relative to section
                zIndex: 0,
                border: '23px solid ' + BORDER_COLOR,
                borderRadius: '117px',
                transform: 'rotate(90deg)',
            }}
        />
    );
};

// --- FAQ Section Border ---

export const RightCrescentBorder = () => {
    const BORDER_COLOR = '#FF541F';
    return (
        <div
            className="pointer-events-none absolute hidden xl:block"
            style={{
                boxSizing: 'border-box',
                width: '445px',
                height: '445px',
                right: '-220px', // Half off-screen
                top: '10%',      // Relative vertical
                zIndex: 0,
                border: '23px solid ' + BORDER_COLOR,
                borderRadius: '50%',
            }}
        />
    );
};