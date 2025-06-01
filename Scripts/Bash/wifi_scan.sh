#!/usr/bin/env bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Step 1: Detect wireless interface
iface=$(iw dev | awk '$1=="Interface"{print $2}' | grep -E '^w')

if [ -z "$iface" ]; then
    echo -e "${RED}❌ No wireless interface found.${NC}"
    exit 1
fi

echo -e "${GREEN}📡 Using interface: $iface${NC}"

# Step 2: Save and kill conflicting services
echo -e "${GREEN}🔧 Checking for conflicting services...${NC}"
conflict_log="conflicting_services.txt"
sudo airmon-ng check | grep -i 'service' | awk '{print $2}' > "$conflict_log"

while read -r svc; do
    echo -e "${RED}🔪 Killing: $svc${NC}"
    sudo systemctl stop "$svc"
done < "$conflict_log"

# Step 3: Start monitor mode
sudo airmon-ng start "$iface"
mon_iface="${iface}mon"

# Check monitor mode started
if ! iw dev | grep -q "$mon_iface"; then
    echo -e "${RED}❌ Monitor interface not found (${mon_iface}).${NC}"
    exit 1
fi

# Disable power saving
sudo iw "$mon_iface" set power_save off

# Step 4: Scan APs
echo -e "${GREEN}🔍 Scanning for nearby APs... Press Ctrl+C when ready to choose.${NC}"
sleep 2
sudo airodump-ng "$mon_iface" --band abg

# Step 5: Get target info from user
read -rp $'\n✏️  Enter target BSSID (MAC): ' target_bssid
read -rp '📻 Enter target channel: ' target_channel
read -rp '💾 Enter capture file name (without extension): ' capname

# Step 6: Lock to channel and start focused capture
echo -e "${GREEN}📡 Locking $mon_iface to channel $target_channel...${NC}"
sudo iwconfig "$mon_iface" channel "$target_channel"

echo -e "${GREEN}📥 Capturing handshakes from $target_bssid on channel $target_channel...${NC}"
sudo airodump-ng --bssid "$target_bssid" -c "$target_channel" -w "$capname" "$mon_iface"

# --- Job done. Restart services ---
echo -e "${GREEN}💤 Done? If you're finished, you can restore killed services with:${NC}"
echo "while read -r svc; do sudo systemctl start \"\$svc\"; done < $conflict_log"

