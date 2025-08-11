#!/usr/bin/env python3
"""
Star List Shape Pyramid

This module provides functionality to create, manipulate, and visualize
star lists in various pyramid shapes and patterns.
"""

import math
from typing import List, Tuple, Optional
from dataclasses import dataclass
import json


@dataclass
class Star:
    """Represents a star with position and properties."""
    x: float
    y: float
    name: str
    magnitude: float
    color: str = "white"
    
    def __str__(self) -> str:
        return f"{self.name} ({self.x}, {self.y}) mag:{self.magnitude}"


class StarListShapePyramid:
    """Manages star lists organized in pyramid shapes."""
    
    def __init__(self):
        self.stars: List[Star] = []
        self.pyramid_layers: List[List[Star]] = []
    
    def add_star(self, star: Star) -> None:
        """Add a star to the collection."""
        self.stars.append(star)
        self._update_pyramid_layers()
    
    def create_triangle_pyramid(self, base_width: int, star_names: Optional[List[str]] = None) -> None:
        """Create a triangle pyramid pattern of stars."""
        if star_names is None:
            star_names = [f"Star_{i}" for i in range(base_width * (base_width + 1) // 2)]
        
        star_index = 0
        for layer in range(base_width):
            layer_stars = []
            stars_in_layer = layer + 1
            spacing = 2.0 / (stars_in_layer + 1)
            
            for i in range(stars_in_layer):
                x = -1.0 + (i + 1) * spacing
                y = 1.0 - layer * 0.5
                
                name = star_names[star_index] if star_index < len(star_names) else f"Star_{star_index}"
                star = Star(x, y, name, magnitude=1.0 + (star_index % 5) * 0.5)
                layer_stars.append(star)
                star_index += 1
            
            self.pyramid_layers.append(layer_stars)
    
    def create_square_pyramid(self, base_size: int, star_names: Optional[List[str]] = None) -> None:
        """Create a square pyramid pattern of stars."""
        if star_names is None:
            star_names = [f"Star_{i}" for i in range(base_size * base_size)]
        
        star_index = 0
        for layer in range(base_size):
            layer_stars = []
            stars_in_layer = (base_size - layer) ** 2
            
            for row in range(base_size - layer):
                for col in range(base_size - layer):
                    x = -1.0 + (col + 0.5) * 2.0 / (base_size - layer)
                    y = 1.0 - (row + 0.5) * 2.0 / (base_size - layer)
                    
                    name = star_names[star_index] if star_index < len(star_names) else f"Star_{star_index}"
                    star = Star(x, y, name, magnitude=1.0 + (star_index % 5) * 0.5)
                    layer_stars.append(star)
                    star_index += 1
            
            self.pyramid_layers.append(layer_stars)
    
    def create_circular_pyramid(self, layers: int, stars_per_layer: int, star_names: Optional[List[str]] = None) -> None:
        """Create a circular pyramid pattern of stars."""
        if star_names is None:
            star_names = [f"Star_{i}" for i in range(layers * stars_per_layer)]
        
        star_index = 0
        for layer in range(layers):
            layer_stars = []
            radius = (layer + 1) / layers
            
            for i in range(stars_per_layer):
                angle = 2 * math.pi * i / stars_per_layer
                x = radius * math.cos(angle)
                y = radius * math.sin(angle)
                
                name = star_names[star_index] if star_index < len(star_names) else f"Star_{star_index}"
                star = Star(x, y, name, magnitude=1.0 + (star_index % 5) * 0.5)
                layer_stars.append(star)
                star_index += 1
            
            self.pyramid_layers.append(layer_stars)
    
    def _update_pyramid_layers(self) -> None:
        """Update the pyramid layers based on current stars."""
        # This is a simple implementation - you can customize based on your needs
        if len(self.stars) <= 1:
            self.pyramid_layers = [self.stars]
        else:
            # Group stars by y-coordinate (layers)
            sorted_stars = sorted(self.stars, key=lambda s: s.y, reverse=True)
            layers = {}
            for star in sorted_stars:
                layer_key = round(star.y * 2) / 2  # Group by 0.5 unit intervals
                if layer_key not in layers:
                    layers[layer_key] = []
                layers[layer_key].append(star)
            
            self.pyramid_layers = [layers[key] for key in sorted(layers.keys(), reverse=True)]
    
    def get_stars_in_layer(self, layer_index: int) -> List[Star]:
        """Get all stars in a specific layer."""
        if 0 <= layer_index < len(self.pyramid_layers):
            return self.pyramid_layers[layer_index]
        return []
    
    def get_star_by_name(self, name: str) -> Optional[Star]:
        """Find a star by its name."""
        for star in self.stars:
            if star.name == name:
                return star
        return None
    
    def get_stars_by_magnitude_range(self, min_mag: float, max_mag: float) -> List[Star]:
        """Get stars within a specific magnitude range."""
        return [star for star in self.stars if min_mag <= star.magnitude <= max_mag]
    
    def export_to_json(self, filename: str) -> None:
        """Export the star pyramid to a JSON file."""
        data = {
            "pyramid_layers": [
                [
                    {
                        "name": star.name,
                        "x": star.x,
                        "y": star.y,
                        "magnitude": star.magnitude,
                        "color": star.color
                    }
                    for star in layer
                ]
                for layer in self.pyramid_layers
            ],
            "total_stars": len(self.stars)
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
    
    def import_from_json(self, filename: str) -> None:
        """Import a star pyramid from a JSON file."""
        with open(filename, 'r') as f:
            data = json.load(f)
        
        self.stars.clear()
        self.pyramid_layers.clear()
        
        for layer_data in data["pyramid_layers"]:
            layer_stars = []
            for star_data in layer_data:
                star = Star(
                    x=star_data["x"],
                    y=star_data["y"],
                    name=star_data["name"],
                    magnitude=star_data["magnitude"],
                    color=star_data.get("color", "white")
                )
                self.stars.append(star)
                layer_stars.append(star)
            self.pyramid_layers.append(layer_stars)
    
    def print_pyramid_ascii(self) -> None:
        """Print an ASCII representation of the pyramid."""
        if not self.pyramid_layers:
            print("No stars in pyramid")
            return
        
        print("Star Pyramid (ASCII Representation):")
        print("=" * 50)
        
        for i, layer in enumerate(self.pyramid_layers):
            print(f"Layer {i + 1}:")
            for star in layer:
                print(f"  {star}")
            print()
    
    def get_statistics(self) -> dict:
        """Get statistics about the star pyramid."""
        if not self.stars:
            return {"error": "No stars in pyramid"}
        
        magnitudes = [star.magnitude for star in self.stars]
        x_coords = [star.x for star in self.stars]
        y_coords = [star.y for star in self.stars]
        
        return {
            "total_stars": len(self.stars),
            "total_layers": len(self.pyramid_layers),
            "magnitude_stats": {
                "min": min(magnitudes),
                "max": max(magnitudes),
                "average": sum(magnitudes) / len(magnitudes)
            },
            "position_stats": {
                "x_range": (min(x_coords), max(x_coords)),
                "y_range": (min(y_coords), max(y_coords))
            }
        }


def demo_star_pyramid():
    """Demonstrate the star pyramid functionality."""
    print("Creating Star List Shape Pyramid Demo")
    print("=" * 40)
    
    # Create a pyramid instance
    pyramid = StarListShapePyramid()
    
    # Create a triangle pyramid
    print("1. Creating Triangle Pyramid...")
    pyramid.create_triangle_pyramid(4)
    pyramid.print_pyramid_ascii()
    
    # Create a square pyramid
    print("\n2. Creating Square Pyramid...")
    square_pyramid = StarListShapePyramid()
    square_pyramid.create_square_pyramid(3)
    square_pyramid.print_pyramid_ascii()
    
    # Create a circular pyramid
    print("\n3. Creating Circular Pyramid...")
    circular_pyramid = StarListShapePyramid()
    circular_pyramid.create_circular_pyramid(3, 6)
    circular_pyramid.print_pyramid_ascii()
    
    # Show statistics
    print("\n4. Triangle Pyramid Statistics:")
    stats = pyramid.get_statistics()
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    # Export to JSON
    print("\n5. Exporting to JSON...")
    pyramid.export_to_json("star_pyramid.json")
    print("  Exported to 'star_pyramid.json'")


if __name__ == "__main__":
    demo_star_pyramid() 