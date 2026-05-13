#!/bin/bash

# A3 STANDARDIZATION ROLLOUT SCRIPT
# This script helps implement the AnswerInputWithCoach component across A3 modules

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Arrays for module organization
declare -a P1_MODULES=("entrenamiento-estructurado" "entrenamiento-guiado" "entrenamiento-conversacional")
declare -a P2_MODULES=("simulaciones-maestria" "simulaciones-guiado" "simulaciones-desafiante" "basic-interview-mission" "conversational-interview")
declare -a P3_MODULES=("risk-difficult-questions-lab" "answer-architecture" "metodo-star" "communication-gym")
declare -a P4_MODULES=("coach-practice-room" "cv-builder-studio" "ajuste-por-vacante")

echo -e "${GREEN}A3 Standardization Rollout Script${NC}"
echo "===================================="
echo ""
echo "Select priority level to implement:"
echo "1. P1 - Core Training (4 modules)"
echo "2. P2 - Interview Simulations (5 modules)"
echo "3. P3 - Specialized Trainings (4 modules)"
echo "4. P4 - Support Tools (3 modules)"
echo "5. All (16 modules)"
echo "6. Status Check"
echo ""
read -p "Enter choice (1-6): " CHOICE

check_implementation() {
  local module=$1
  local path="/vercel/share/v0-project/app/despega/a3/${module}/page.tsx"
  
  if grep -q "AnswerInputWithCoach" "$path" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} $module - Implemented"
    return 0
  else
    echo -e "${YELLOW}○${NC} $module - Needs implementation"
    return 1
  fi
}

case $CHOICE in
  1)
    echo -e "\n${YELLOW}P1 Modules - Core Training${NC}"
    echo "Modules to implement:"
    for module in "${P1_MODULES[@]}"; do
      check_implementation "$module"
    done
    ;;
  2)
    echo -e "\n${YELLOW}P2 Modules - Interview Simulations${NC}"
    echo "Modules to implement:"
    for module in "${P2_MODULES[@]}"; do
      check_implementation "$module"
    done
    ;;
  3)
    echo -e "\n${YELLOW}P3 Modules - Specialized Trainings${NC}"
    echo "Modules to implement:"
    for module in "${P3_MODULES[@]}"; do
      check_implementation "$module"
    done
    ;;
  4)
    echo -e "\n${YELLOW}P4 Modules - Support Tools${NC}"
    echo "Modules to implement:"
    for module in "${P4_MODULES[@]}"; do
      check_implementation "$module"
    done
    ;;
  5)
    echo -e "\n${YELLOW}All Modules Status${NC}"
    echo "P1 - Core Training:"
    for module in "${P1_MODULES[@]}"; do
      check_implementation "$module"
    done
    echo ""
    echo "P2 - Interview Simulations:"
    for module in "${P2_MODULES[@]}"; do
      check_implementation "$module"
    done
    echo ""
    echo "P3 - Specialized Trainings:"
    for module in "${P3_MODULES[@]}"; do
      check_implementation "$module"
    done
    echo ""
    echo "P4 - Support Tools:"
    for module in "${P4_MODULES[@]}"; do
      check_implementation "$module"
    done
    ;;
  6)
    echo -e "\n${YELLOW}Implementation Status${NC}"
    total=0
    implemented=0
    for module in "${P1_MODULES[@]}" "${P2_MODULES[@]}" "${P3_MODULES[@]}" "${P4_MODULES[@]}"; do
      ((total++))
      if check_implementation "$module"; then
        ((implemented++))
      fi
    done
    echo ""
    echo -e "Progress: ${GREEN}${implemented}/${total}${NC} modules implemented"
    percentage=$((implemented * 100 / total))
    echo "Completion: ${percentage}%"
    ;;
  *)
    echo -e "${RED}Invalid choice${NC}"
    exit 1
    ;;
esac

echo ""
echo "For next steps, refer to A3_IMPLEMENTATION_GUIDE.md"
