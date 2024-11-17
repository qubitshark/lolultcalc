document.addEventListener('DOMContentLoaded', () => {
    const championSelect = document.getElementById('champion');
    const form = document.getElementById('cooldown-form');
    const resultDiv = document.getElementById('result');

    let championData = {}; 
    fetch('champion.json')
        .then(response => response.json())
        .then(data => {
            championData = data.data; 
            for (const key in championData) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = championData[key].name;
                championSelect.appendChild(option);
            }
        })
        .catch(error => console.error('Error fetching champion data:', error));

    form.addEventListener('submit', event => {
        event.preventDefault();

        const abilityHaste = parseFloat(document.getElementById('ability-haste').value);
        const championKey = document.getElementById('champion').value;
        const level = parseInt(document.getElementById('level').value);

        const hasMalignance = document.getElementById('malignance').checked;
        const hasUltimateHunter = document.getElementById('ultimate-hunter').checked;
        const hasHexplate = document.getElementById('hexplate').checked;

        if (!championKey) {
            resultDiv.textContent = 'champion';
            return;
        }

        const selectedChampion = championData[championKey];

        const ultimateSpell = selectedChampion.spells.find(spell => spell.id.endsWith('R'));

        if (!ultimateSpell) {
            resultDiv.textContent = 'no ult found.';
            return;
        }

        const cooldowns = ultimateSpell.cooldown;

        // eugh
        let baseCooldown;
        if (level >= 16) {
            baseCooldown = cooldowns[2];
        } else if (level >= 11) {
            baseCooldown = cooldowns[1];
        } else if (level >= 6) {
            baseCooldown = cooldowns[0];
        } else {
            resultDiv.textContent = 'Ulitimate not available below level 6.';
            return;
        }

        let ultimateHaste = 0;
        if (hasMalignance) ultimateHaste += 20;
        if (hasUltimateHunter) ultimateHaste += 31;
        if (hasHexplate) ultimateHaste += 30;

        const totalHaste = abilityHaste + ultimateHaste;

        const cooldownReduction = totalHaste / (totalHaste + 100);

        const currentCooldown = baseCooldown * (1 - cooldownReduction);

        resultDiv.textContent = `current Ultimate Cooldown: ${currentCooldown.toFixed(2)} seconds`;
    });
});
