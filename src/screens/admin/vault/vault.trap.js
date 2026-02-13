export function vaultTrap(onTrigger) {
  return {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'auto',
    height: '1px',
    width: '1px',
    zIndex: -1,
    onClick: () => {
      onTrigger({
        type: 'BOT_TRAP',
        time: Date.now()
      })
    }
  }
}