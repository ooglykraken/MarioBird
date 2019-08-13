



Shader "Custom/Unlit Alpha" {  
Properties {
    _Color ("Color Tint (A = Opacity)", Color) = (1,1,1,1)
    _MainTex ("Texture (A = Transparency)", 2D) = ""
}

SubShader {
    Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
	LOD 100
	
    ZWrite Off
    Blend SrcAlpha OneMinusSrcAlpha
	
    Pass {
		Lighting Off
        SetTexture[_MainTex] {Combine texture * constant ConstantColor[_Color]}
    }
}

}