export const statusLabel = [
  { key: 'fighting', label: 'Combatendo' },
  { key: 'out_of_combat', label: 'Fora de combate' },
  { key: 'patrolling', label: 'Patrulhando' },
  { key: 'resting', label: 'Descansando' },
];

export function getLabel(key) {
  const status = statusLabel.find((s) => s.key === key);
  return status?.label ?? '';
}
