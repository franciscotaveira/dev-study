import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

// The marker for curriculum.map is:
//             <div className="space-y-4">
//             {curriculum.map((mod, modIdx) => (
// Until the closing of Left Column:
//           </div>
//         </div>
// 
//         {/* Right Column - Active Module & Timer */}

// 1. Find the chunk that represents Active Module to Metas (1330 to 1674 roughly).
// Let's use string indexOf to find exact positions.

const curriculumStart = content.indexOf('            <div className="space-y-4">\n            {curriculum.map((mod, modIdx) => (');
const leftColEnd = content.indexOf('          </div>\n        </div>\n\n        {/* Right Column - Active Module & Timer */}');

const rightColComponentStart = content.indexOf('            {/* Active Task Card */}');
const rightColComponentEnd = content.indexOf('            {/* Abas do Mentor & Laboratório */}');

if (curriculumStart > -1 && leftColEnd > -1 && rightColComponentStart > -1 && rightColComponentEnd > -1) {
  const rightComponents = content.slice(rightColComponentStart, rightColComponentEnd);
  
  // Replace curriculum with rightComponents
  const firstHalf = content.slice(0, curriculumStart);
  const secondHalfAfterCurriculum = content.slice(leftColEnd); // starts with "          </div>\n        </div>"
  
  const tempContent = firstHalf + rightComponents + secondHalfAfterCurriculum;
  
  // Now remove the original rightComponents from where they were in the tempContent
  // Note: Since we appended rightComponents earlier, the SECOND occurrence of rightComponents is the one we want to remove.
  // Wait, rightComponents is unique. Let's find its new index after the insertion.
  const newRightColStart = tempContent.indexOf('        {/* Right Column - Active Module & Timer */}');
  const finalRightComponentsStart = tempContent.indexOf('            {/* Active Task Card */}', newRightColStart);
  
  const finalContent = tempContent.slice(0, finalRightComponentsStart) + tempContent.slice(finalRightComponentsStart + rightComponents.length);
  
  // Also change the right col span to 7
  const fixedContent = finalContent.replace(
    'isImmersiveMode ? "lg:col-span-12 max-w-4xl mx-auto w-full" : "lg:col-span-5"',
    'isImmersiveMode ? "lg:col-span-12 max-w-4xl mx-auto w-full" : "lg:col-span-7"'
  );
  
  fs.writeFileSync('src/App.tsx', fixedContent);
  console.log('Success!');
} else {
  console.log('Failed to find indices');
  console.log(curriculumStart, leftColEnd, rightColComponentStart, rightColComponentEnd);
}
